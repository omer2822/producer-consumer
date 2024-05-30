import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class S1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

        
    const eventBus = new events.EventBus(this, 'MyEventBus', {
      eventBusName: 'MyEventBus'
    });

    // // Emit a custom event to the event bus

    const eventRule = new events.Rule(this, 'MyEventRule', {
      eventPattern: {
        source: ['my-app'],
        detailType: ['myMessageType'],
      },
      targets: [new targets.EventBus(eventBus)]     
    });


    const myLambda = new NodejsFunction(this, 'put-lambda', {
      entry: path.normalize(__dirname + '/../lambda/send.ts'),
      handler: 'handler',
    });

    const lambdaURL = myLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.BUFFERED,
    });

    new cdk.CfnOutput(this, 'lambda-url', {
      value: lambdaURL.url
    });

    eventRule.addTarget(new targets.LambdaFunction(myLambda));

    eventBus.grantPutEventsTo(myLambda);


  }
}

/*

import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct, Stack, StackProps } from 'aws-cdk-lib';
import { Rule, EventBus } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { CfnOutput } from 'aws-cdk-lib';

export class S1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const eventBus = new EventBus(this, 'MyEventBus', {
      eventBusName: 'MyEventBus'
    });

    const eventRule = new Rule(this, 'MyEventRule', {
      eventPattern: {
        source: ['my-app'],
        detailType: ['myMessageType'],
      },
      targets: [new EventBus(eventBus)]
    });

    const myLambda = new NodejsFunction(this, 'put-lambda', {
      entry: path.resolve(__dirname, '../lambda/send.ts'),
      handler: 'handler',
    });

    const lambdaURL = myLambda.functionUrl;

    new CfnOutput(this, 'lambda-url', {
      value: lambdaURL
    });

    eventRule.addTarget(new LambdaFunction(myLambda));

    eventBus.grantPutEventsTo(myLambda);
  }
}

*/
