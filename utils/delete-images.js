const fs = require('fs');
const path = require('path');

const imageDirectory = './public/img/uploads/';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function deleteImages(images){
    fs.readdir(imageDirectory, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }
    
        const imageFiles = files.filter(file => images.includes(file));
    
        // Delete each image file
        imageFiles.forEach(file => {
            const filePath = path.join(imageDirectory, file);
    
            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                }
            });
        });
    });
};
module.exports = deleteImages;