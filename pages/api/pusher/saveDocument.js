const Pusher = require("pusher");
import Post from "../models/Post";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default async (req, res) => {
  const { documentId, data } = req.body;

  if(!documentId || !data) return res.status(400).end();

  // Auto-save logic placeholder

  res.status(200).end();
};
