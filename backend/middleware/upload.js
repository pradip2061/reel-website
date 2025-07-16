const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { image} = require('../utils/cloudinary');
const upload = multer({storage:storage });
const profileupload = multer({storage:image });
module.exports = {upload,profileupload};