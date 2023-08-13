const Post = require("../models/Post");
const User = require("../models/User");
const { cloudinary } = require("../cloudinary");
const slugify = require("slugify");

const getAllPosts = async (req, res) => {
  // Get all posts from MongoDB
  const posts = await Post.find();

  // Neccessary in order to access the virtuals defined in the model
  const postObjects = posts.map((post) => post.toObject({ virtuals: true }));

  // If no posts
  if (!posts?.length) {
    return res.status(400).json({ message: "No posts found" });
  }

  // Add roles to each post before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const postsWithUser = await Promise.all(
    postObjects.map(async (post) => {
      const user = await User.findById(post.user).lean().exec();
      if (!user) return { ...post };
      return { ...post, roles: user.roles };
    })
  );

  res.json(postsWithUser);
};

const createNewPost = async (req, res) => {
  const { documentId, title, content, data, displayedUsername, userId } = req.body;

  const post = await Post.findById(documentId).exec();

  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  if (!documentId || !title || !displayedUsername || !content || !data || !userId) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const duplicate = await Post.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== documentId) {
    return res.status(409).json({ error: "Duplicate post title" });
  }

  const slug = slugify(title);
  post.title = title;
  post.data = data;
  post.content = content;
  post.user = userId;
  post.slug = slug;
  post.displayedUsername = displayedUsername;

  // Get images from Cloudinary
  const urlRegex = /https:\/\/res\.cloudinary\.com\/[^"]+/g;
  const urlsInContent = content.match(urlRegex);

  const result = await cloudinary.search
      .expression(`folder:ArtificEon/recordStorage/${documentId}`)
      .execute();

  // Update post.images in the order the images appear in content
  if (urlsInContent) {
    const newImages = urlsInContent.map((url) => {
      const resource = result.resources.find(
        (resource) => resource.secure_url === url
      );
      return {
        url: resource.secure_url,
        filename: resource.public_id,
      };
    });

    post.images = newImages;
  }

  const savedPost = await post.save();

  res.status(201).json(savedPost);
};

// @desc Update a post
// @route PATCH /posts
// @access Private
const updatePost = async (req, res) => {
  const { documentId, displayedUsername, title, content, data } = req.body;

  if (!documentId || !displayedUsername || !title || !content || !data) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const post = await Post.findById(documentId).exec();

  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  const duplicate = await Post.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== documentId) {
    return res.status(409).json({ error: "Duplicate post title" });
  }

  const slug = slugify(title);

  post.title = title;
  post.slug = slug;
  post.data = data;
  post.content = content;
  post.displayedUsername = displayedUsername;

  // Get images from Cloudinary
  const urlRegex = /https:\/\/res\.cloudinary\.com\/[^"]+/g;
  const urlsInContent = content.match(urlRegex);

  const result = await cloudinary.search
    .expression(`folder:ArtificEon/recordStorage/${documentId}`)
    .execute();

  // Update post.images in the order the images appear in content
  if (urlsInContent) {
    const newImages = urlsInContent.map((url) => {
      const resource = result.resources.find(
        (resource) => resource.secure_url === url
      );
      return {
        url: resource.secure_url,
        filename: resource.public_id,
      };
    });

    post.images = newImages;
  }

  const updatedPost = await post.save();

  res.json({
    message: `'${updatedPost.title}' updated`,
    slug: updatedPost.slug,
  });
};

// @desc Delete a post
// @route DELETE /posts
// @access Private
const deletePost = async (req, res) => {
  const { documentId } = req.query;

  // Confirm data
  if (!documentId) {
    return res.status(400).json({ error: "Post ID required" });
  }

  // Confirm post exists to delete
  const post = await Post.findById(documentId).exec();

  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  // Delete images from Cloudinary
  if (post.images && post.images.length > 0) {
    const deleteImages = async (images) => {
      for (const image of images) {
        const publicId = image.filename;
        console.log("DELETE IMAGES:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    };

    await deleteImages(post.images);

    await cloudinary.api.delete_folder(
      `ArtificEon/recordStorage/${documentId}`
    );
  }

  const result = await post.deleteOne();

  console.log("DELETE RESULT:", result);

  const reply = `Post '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllPosts,
  createNewPost,
  updatePost,
  deletePost,
};
