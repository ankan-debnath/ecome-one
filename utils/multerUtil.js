const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { model } = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/uploads')
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, (err, name)=>{
        let fn = name.toString('hex') + path.extname(file.originalname);
        cb(null,fn);
      });
    }
});

const uploda = multer( { storage });

module.exports = uploda;