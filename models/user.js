const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart : {
        products : [],
        cart_total :  {
            type : Number,
            default : 0
        }
    },
    address: [{
        name : {type : String},
        mobile : {type : Number},
        add1 : {type : String},
        add2 : {type : String},
        city : { type : String},
        district : {type : String},
        pin : {type : Number},
        type : {type : String}
    }],
    order : [String]
});

module.exports = mongoose.model('user', userSchema);