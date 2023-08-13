const Post = require("../models/Post");
const { cloudinary } = require("../cloudinary");

const handleImageUpload = async (req, res) => {
  // console.log("HANLDER:", req.body);

  let urls;
  if (req.files) {
    const newImages = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    // Get URLs of uploaded images
    urls = newImages.map((result) => result.url);

    if (newImages && urls.length > 0)
      return res.status(201).json({ data: urls });
  }
};

const deleteImage = async (req, res) => {
  const { postId, imgUrl } = req.query;

  const post = await Post.findById(postId).exec();

  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  let publicId;

  if (imgUrl) {
    publicId = `ArtificEon/recordStorage/${postId}/${imgUrl.split("/").pop().split(".")[0]}`;
    // console.log("PID:", publicId)

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary SDK response:", result);
  }
};

module.exports = {
  handleImageUpload,
  deleteImage,
};
