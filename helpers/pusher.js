import Pusher from "pusher-js";

// Create the Pusher instance
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  channelAuthorization: { endpoint: "/api/pusher/auth"},
});

// Function for subscribing to a channel
export const subscribeToChannel = (encodedDocumentId) => {
  if(!pusher) return;
  // Check if a subscription already exists
  
  const existingChannel = pusher.channel(`private-${encodedDocumentId}`);
  if (existingChannel) {
    console.log("REACHED SUB FUNCTION")
    // If a subscription already exists, return the existing channel
    return existingChannel;
  } else {
    console.log("REACHED MAIN FUNCTION")
    // If no subscription exists, subscribe to the channel and return the new channel
    const channel = pusher.subscribe(`private-${encodedDocumentId}`);
    return channel;
  }
};

export const sendChanges = async (options, pusher) => {
  if (!options.delta || !pusher) return;

  await fetch("/api/pusher/sendChanges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ options, socketId: pusher.connection.socket_id }),
  });
};

export const getDocument = async (options) => {
  if (!options.documentId || !options.userId) return;

  const { documentId, userId, deltaFormat } = options;
  return await fetch("/api/pusher/getDocument", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId: documentId,
      userId: userId,
      deltaFormat: deltaFormat,
    }),
  });
};

export const postCreateUpdate = async (pusher, encodedDocumentId, data) => {
  if (!data || !encodedDocumentId || !pusher) return;

  await fetch("/api/pusher/postCreateUpdate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encodedDocumentId, data, socketId: pusher.connection.socket_id }),
  });
};

export const postDelete = async (data, pusher) => {
  if (!data || !pusher) return;

  await fetch("/api/pusher/postDelete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, socketId: pusher.connection.socket_id }),
  });
};

// Export the Pusher instance
export default pusher;
