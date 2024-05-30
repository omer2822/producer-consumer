import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

exports.handler = async (event: any = {}) => {

  const client = new DynamoDBClient({ region: "us-east-1" });
  const dynamo = DynamoDBDocumentClient.from(client);

  try {
    const params = {
      TableName: "consumeTable",
      Item: {
        id: event.id,
        message: event.detail.message
      }
    };
    // Access the event data (message) from the 'detail' field
    await dynamo.send(new PutCommand(params));
    // Process the message as needed
    console.log('Received message:', event);

    return {
      statusCode: 200,
      body: JSON.stringify('Message processed successfully'),
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing message'),
    };
  }
};

