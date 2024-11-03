const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/create', (req, res) => {
    let email = 'example@gmail.com';
    const token = jwt.sign( { email }, 'shhh');
    res.cookie('token', token);
    res.send("Cookie created");
});

app.get('/', (req, res) => {
    console.log(req.cookies);
    res.send("Done");
});

app.get('/remove', (req, res) => {
    res.clearCookie('token');
    res.send("Cookie removed"); 
});


app.listen(PORT, ()=>{
    console.log("Server is running at port", PORT);
});