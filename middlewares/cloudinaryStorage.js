const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // import your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // You can change this name
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
  },
});

const upload = multer({ storage });

module.exports = upload;    
