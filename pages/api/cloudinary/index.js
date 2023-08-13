const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Assosciating the cloudinary account with this cloudinary instance.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Creating an instance of CloudinaryStorage, passing in the cloudinary object that was configured, folder in cloudinary where to store the files in
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ArtificEon",
    allowedFormats: ["jpeg", "png", "jpg", "gif", "webp"],
  },
});

const getRecordStorage = (recFolder) => {
    const folder = `ArtificEon/recordStorage/${recFolder}`;
    console.log(`folder: ${folder}`);
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder,
        allowedFormats: ["jpeg", "png", "jpg", "gif", "webp"],
      },
    });
  };

module.exports = {
  cloudinary,
  storage,
  getRecordStorage,
};
