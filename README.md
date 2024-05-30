# producere-consumer
This project explores communication patterns in AWS using a producer-consumer architecture implemented using Amazon EventBridge.
Overview

The implementation consists of two main components:

    Producer Stack: This stack includes an EventBridge EventBus and a Lambda function responsible for producing events and putting them into the EventBus buffer.

    Consumer Stack: This stack comprises a DynamoDB table and a Lambda function triggered by events inserted into the EventBus. The Lambda function processes the events and writes them to the DynamoDB table.
