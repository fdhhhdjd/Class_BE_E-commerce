const cloudinaryConfig = require("../configs/cloudinary.conf");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: cloudinaryConfig.CloudName,
  api_key: cloudinaryConfig.ApiKey,
  api_secret: cloudinaryConfig.ApiSecret,
});

module.exports = cloudinary;
