import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default async (req, res) => {
  const { socket_id: socketId, channel_name: channelName } = req.body;
  const auth = pusher.authorizeChannel(socketId, channelName);
  res.send(auth);
};
