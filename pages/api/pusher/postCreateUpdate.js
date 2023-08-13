import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default async (req, res) => {
  const { encodedDocumentId, data, socketId } = req.body;

  if(!encodedDocumentId || !data || !socketId) return res.status(400).end();

  pusher.trigger(
    `private-${encodedDocumentId}`,
    "postCreatedOrUpdated",
    data,
    socketId
  );

  res.status(200).end();
};
