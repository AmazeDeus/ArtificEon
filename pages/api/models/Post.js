const { Schema, model, models } = require("mongoose");

const imageSchema = new Schema({
  // url and filename are variables returned when saving images to cloudinary
  url: String,
  filename: String,
});

// Display a particular image with width:400 (Used in featuredHeadine.js. See "getAllPosts" controller for defining the response).
// On every image, a "thumbnail" property is created, which can be called later on.
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_400");
});

// Allow virtuals to be included
const opts = { toJSON: { virtuals: true } };

const Post = new Schema(
  {
    _id: String,
    data: Object,
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    images: [imageSchema], // array because possibility of multiple images uploaded.
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    content: {
      type: {},
      required: true,
      min: 20,
      max: 2000000,
    },
    user: {
      type: Schema.Types.ObjectId, // ref to the User model (A post is assigned to a user)
      required: true,
      ref: "User",
    },
    displayedUsername: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true },
  opts
);

module.exports = models.Post || model("Post", Post);
