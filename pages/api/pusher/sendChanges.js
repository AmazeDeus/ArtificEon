// pages/api/pusher/sendChanges.js
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default async (req, res) => {
  const { socketId, options } = req.body;

  const {
    encodedDocumentId: documentId,
    delta,
    insertedImage,
  } = options;

  if (!socketId || !documentId || !delta)
    return res.status(400).end();

  let changesResponse;
  insertedImage
    ? (changesResponse = { delta, socketId, insertedImage })
    : (changesResponse = { delta, socketId });

  pusher.trigger(
    `private-${documentId}`,
    "receive-changes",
    changesResponse,
    socketId
  );

  res.status(200).end();
};
