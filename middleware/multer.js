const multer = require('multer');
const MINE_TYPES = {
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/png":"png",
    "image/webp": "webp",
    "image/gif": "gif"
};

const saving = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'Images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(".")[0].split(' ').join('_');
        const extension = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage:saving}).single('image');