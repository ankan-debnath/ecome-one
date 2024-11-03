const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email : String,
    products : [{
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    }]
});

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;