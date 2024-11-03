const express = require('express');
const path = require('path')
const productModel = require('./models/product');
const userModel = require('./models/user')
const adminModel = require('./models/admin');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const user = require('./models/user');
const jwt = require('jsonwebtoken');
const uploda = require('./utils/multerUtil');
const deleteImages = require('./utils/delete-images');
const { constrainedMemory } = require('process');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/', ifUserexists, async (req,res) => {
    let product = await productModel.find();
    return res.render('index', { user : req.user, isAdmin : req.isAdmin, product, navSection : 'home' });
});

app.get('/admin/:id', async (req, res) => {
    let admin = await adminModel.findOne({_adminid : req.params.id})
    if(admin){
        let user = await userModel.findOne({_id : req.params.id})
        res.send(user);
    }
    else
        res.send("you are not admin");
});

app.get('/create-product', isLoggedin, isAdmin, (req, res) => {
    return res.render('create-product', { user : req.user, activeSection : 'profile' });
});

app.post('/add-product', isLoggedin, isAdmin, uploda.array('image', 5), async (req, res) => {
    const email = req.user.email;
    const { name, brand, price, rating, description } = req.body;
    const images = [];
    
    req.files.forEach( (f) => {
        images.push(f.filename);
    });

    const new_product = await productModel.create({
        name, price, brand, rating, description,
        email,
        images
    });

    let admin = await adminModel.findOne( { email });
    admin.products.push(new_product._id);
    await admin.save();

    return res.redirect('/adminPannel');
});

app.get('/product/:id', ifUserexists, async (req, res) =>{
    let product = await productModel.find();
    let main_product = await productModel.findOne( { _id : req.params.id });
    if(main_product)
        return res.render("product", { main_product, user : req.user, isAdmin : req.admin, product, navSection : 'shop' });
    else
        return res.send("No product found");
});

app.post('/add-to-cart/:id', isLoggedin, async (req, res) =>{
    const user = req.user;
    const productid = req.params.id;
    const quantity = req.body.quantity;
    const product = await productModel.findOne({ _id : productid});
    let subtotal = product.price * quantity;
    
    user.cart.products.push({
        productid,
        brand: product.brand,
        name : product.name,
        quantity,
        price : product.price,
        subtotal,
        image : product.images[0]
    });
    user.cart.cart_total += subtotal    ;
    await user.save();

    res.redirect('/cart');
});

app.get('/remove-from-cart/:id', isLoggedin, async (req, res)=>{
    const id = req.params.id;
    const user = req.user;
    user.cart.cart_total -= user.cart.products[id].subtotal;
    user.cart.products.splice(id, 1);
    await user.save();
    res.redirect('/cart');
});

app.get('/cart', isLoggedin, async (req, res) =>{
    const cart = req.user.cart;

    res.render('cart', {user : req.user, isAdmin : req.isAdmin, cart, navSection : 'cart' });
});

app.get('/login-page', (req, res)=>{
    res.render('login',  { navSection : 'login' });
});

app.post('/signup', async (req, res) =>{
    const { name, email, password } = req.body;
    let exists = await userModel.findOne({email})
    if(exists)  {
        return res.render('login', { 
            message : { 
                text : "User already exists",
                color : "red"
            } 
        });
    }
    else{
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hashPassword) =>{
                let new_user = await userModel.create({
                    name,
                    email,
                    password : hashPassword
                });
                return res.render('login', { 
                    message : { 
                        text : "Registration successful! Login to continue",
                        color : "green"
                    } 
                });
            });
        });
    }
});

app.post('/login', async (req, res) =>{
    const {email, password} = req.body;

    let user = await userModel.findOne( { email } );
    if(user){
        bcrypt.compare(password, user.password, (err, result) => {
            if(result){
                const token = jwt.sign( { email }, 'shhh');
                res.cookie('token', token);
                return res.redirect('/');
            }
            else
                return res.render('login', { 
                    message : { 
                        text : "Email or Password is incorrect",
                        color : "red"
                    },
                    navSection : 'login'
                });
        });
    }
    else
        return res.render('login', { 
            message : { 
                text : "Email or Password is incorrect",
                color : "red"
            },
            navSection : 'login' 
        });
});

app.get('/logout', (req, res)=>{
    res.clearCookie('token');
    return res.redirect('/');
});

app.get('/adminPannel', isLoggedin, isAdmin, async (req, res) =>{
    const admin = req.isAdmin;

    let listing = await productModel.find( { email : admin.email });

    res.render('adminPannel', { user : req.user, listing, admin, isAdmin : admin, navSection : 'profile'});
});

app.get('/profile/:section', isLoggedin, async (req, res) => { 
    let activeSection = req.params.section;
    
    return res.render('profile', { user : req.user, activeSection, isAdmin : req.isAdmin, navSection : 'profile'} );
});

app.post('/add-address', isLoggedin, async (req, res) =>{
    let new_address = req.body;
    let user = req.user;
    user.address.push(new_address);
    await user.save();
    return res.redirect('/profile/my-addresses')
});

app.get('/delete-product/:user_id/:id', async (req, res)=>{
    const product = req.params.id;
    const user_id = req.params.user_id;
    
    let admin = await adminModel.findOne({ _id : user_id});
    console.log(admin)
    let deletedProduct = await productModel.findOne({ _id : admin.products[product]});

    await productModel.findOneAndDelete( { _id : admin.products[product]});

    deleteImages(deletedProduct.images);

    admin.products.splice(product, 1);
    admin.save();

    res.redirect('/adminPannel');
});

app.get('/check', (req,res)=>{
    console.log(req.cookies);
    res.send("Hi");
});

app.get('/shop', ifUserexists, async (req, res) => {
    const products = await productModel.find();

    res.render('shop', { products, user : req.user, isAdmin : req.isAdmin, navSection : 'shop' });
});

async function isLoggedin(req, res, next){
    let token = req.cookies.token;
    if(token){ 
        let { email } = jwt.verify(token, 'shhh');
        let user = await userModel.findOne({ email });
        if(user){
            let isAdmin = await adminModel.findOne( { email });
            req.isAdmin = isAdmin;
            req.user = user;
            return next();
        }
        else
            res.clearCookie('token');
    }
    return res.render('login',  { navSection : 'login'});
}
async function isAdmin(req, res, next) {
    if(req.user){
        let admin = await adminModel.findOne( { email : req.user.email });
        if(admin){
            req.isAdmin = admin;
            return next();
        }
    }
    return res.send("Sorry you are not admin");
}
async function ifUserexists(req, res, next){
    let token = req.cookies.token;
    if(token){ 
        let { email } = jwt.verify(token, 'shhh');
        let user = await userModel.findOne({ email });
        if(user){
            let isAdmin = await adminModel.findOne( { email });
            req.isAdmin = isAdmin;
            req.user = user;
        }
        else
            res.clearCookie('token');
    }
    next();
}

app.listen(PORT, (req, res)=>{
    console.log('Server is running at port', PORT);
});