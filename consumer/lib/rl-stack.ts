import { Stack, StackProps } from 'aws-cdk-lib';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { normalize } from 'path';
import { Table, AttributeType }from "aws-cdk-lib/aws-dynamodb";


import { Construct } from 'constructs';

export class RlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sympleTable = new Table(this, 'consumeTable', {
      tableName: 'consumeTable',
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }  
    });
    
    const myLambda = new NodejsFunction(this, 'cons-lambda', {
      entry: normalize(__dirname + '/../lambda/consume.ts'),
      handler: 'handler',
    });
    
    myLambda.addEnvironment('TABLE_NAME', sympleTable.tableName);
    
    sympleTable.grantWriteData(myLambda);

    const eventBus = EventBus.fromEventBusName(this, 'MyEventBus', 'MyEventBus');

    const rule = new Rule(this, 'Rule', {
      eventBus,
      eventPattern: {
        source: ['my-app'],
        detailType: ['myMessageType']
      }
    });
    

    rule.addTarget(new LambdaFunction(myLambda));

  }
}
