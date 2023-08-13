import Post from "../models/Post";

async function findOrCreatePost(options) {
  const { documentId, userId } = options;
  if (!documentId || !userId) return;

  const document = await Post.findById(documentId);
  // console.log("DOCUMENT ON SERVER:", document)

  if (document) return document;
  return await Post.create({
    _id: documentId,
    data: "",
    title: "Post Title",
    images: [],
    content: {},
    slug: documentId,
    user: userId,
    content: "",
  });
}

// pages/api/pusher/getDocument.js
export default async (req, res) => {
  const { documentId, userId, deltaFormat } = req.body;

  if (!documentId || !userId) return res.status(400).end();

  const document = await findOrCreatePost(req.body);

  const data = deltaFormat ? document.data : document.content; // (if saving the quill delta) -- deltaFormat ? document.data : document.content --> document.data - edit post / document.content - new post

  res.status(201).json(data);
};
