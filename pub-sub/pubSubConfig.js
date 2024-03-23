import { PubSub } from "@google-cloud/pubsub";

// Create an instance of PubSub with the provided service account key
const pubSubClient = new PubSub({
  projectId: "csye6225-a03",
});
 



export const publishMessage = async (topicName, payload) => {
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  try {
    const messageId = await pubSubClient
      .topic(topicName)
      .publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published.`);
    return messageId;
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
};
