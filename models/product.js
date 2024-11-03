const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Ecomone");

const productSchema = mongoose.Schema({
    email : String,
    name : String,
    brand : String,
    rating : Number,
    price : Number,
    description : String,
    images : [String]
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
