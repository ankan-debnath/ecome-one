const productModel = require('./productModel');

async function fun(){
    let product = await productModel.create({
        name:'Cartoon Astronaut T-Shirt',
        brand: 'adidas',
        rating: 4,
        price: 139.00,
        images:[
            '/img/products/f1.jpg',
            '/img/products/f2.jpg',
            '/img/products/f3.jpg',
            '/img/products/f4.jpg',
            '/img/products/f5.jpg'
        ]
    });
    console.log(product);
    product.connection.close();
}

fun();
mongoose.connection.close()