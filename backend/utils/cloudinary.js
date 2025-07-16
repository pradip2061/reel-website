const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage (for video)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videos",
    resource_type: "video", // IMPORTANT for video upload
    format: async (req, file) => "mp4", // optional
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const image = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile images', // optional folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

module.exports = {
  cloudinary,
  storage,
  image
};