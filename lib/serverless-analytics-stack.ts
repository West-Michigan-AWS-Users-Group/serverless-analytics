import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import {AllAlarmTypes, Swa} from 'serverless-website-analytics';

export class ServerlessAnalyticsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const alarmTopic = new sns.Topic(this, "alarm-topic");

    new sns.Subscription(this, "alarm-topic-subscription", {
      topic: alarmTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: 'justin.wheeler@wheeleruniverse.com',
    });

    new Swa(this, 'serverless-analytics', {
      allowedOrigins: ['https://wheelerrecommends.com'],
      awsEnv: {
        account: this.account,
        region: this.region,
      },
      environment: 'prod',
      observability: {
        dashboard: true,
        alarms: {
          alarmTopic,
          alarmTypes: AllAlarmTypes
        },
      },
      isDemoPage: false,
      sites: [
        'wheelerrecommends.com',
      ],
    });

  }
}