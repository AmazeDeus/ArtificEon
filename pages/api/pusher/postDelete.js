import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

export default async (req, res) => {
  const { documentId, socketId } = req.body;

  if(!documentId || !socketId) return res.status(400).end();

  const encodedDocumentId = encodeURIComponent(documentId); // For Pusher: In cases of invalid characters

  pusher.trigger(`private-${encodedDocumentId}`, 'postDelete', documentId, socketId);

  res.status(200).end();
};
