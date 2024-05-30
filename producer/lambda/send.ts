import { EventBridge } from "aws-sdk";
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");



exports.handler = async (event: any = {}): Promise<any> => {
  const eventBridge = new EventBridge();

  const eventBridgeClient = new EventBridgeClient({ region: 'us-east-1' });
  const events = [
    {
      EventBusName: 'MyEventBus',
      Source: 'my-app',
      DetailType: 'myMessageType',

      Detail: JSON.stringify({
        id: '123',
        message: 'Hello from my custom event!'
      })
    },
    // Add more events here if needed
  ];

  try {

    const command = new PutEventsCommand({ Entries: events })

    const data = await eventBridgeClient.send(command);
    

    return {
      statusCode: 200,
      body: "Hello from Lambda!"
    };

  } catch (err) {
    console.error(err); 
    return {
        statusCode: 500,
        body: "Error puttind event in eventBus"
    };
  }
};