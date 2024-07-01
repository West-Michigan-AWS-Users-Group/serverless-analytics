import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import {AllAlarmTypes, Swa} from 'serverless-website-analytics';
import {applyTags} from "../utils/tags";

interface ServerlessAnalyticsStackProps extends cdk.StackProps {

  /**
   * Common tags that should be passed through onto every resource as-is
   */
  sharedTags: { [p: string]: string };
}

export class ServerlessAnalyticsStack extends cdk.Stack {
  private readonly logicalStackName = 'ServerlessAnalyticsStack';

  constructor(scope: Construct, id: string, props: ServerlessAnalyticsStackProps) {
    super(scope, id, props);
    applyTags({
      resource: this,
      resourceName: 'ServerlessAnalyticsStack',
      stackName: this.logicalStackName,
      tags: props.sharedTags,
    });

    const snsTopic = new sns.Topic(this, 'alarm-topic');
    applyTags({
      resource: snsTopic,
      resourceName: 'SnsTopic',
      stackName: this.logicalStackName,
      tags: props.sharedTags,
    })

    const snsSubscription = new sns.Subscription(this, 'alarm-topic-subscription', {
      topic: snsTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: 'justin.wheeler@wheeleruniverse.com',
    });
    applyTags({
      resource: snsSubscription,
      resourceName: 'SnsSubscription',
      stackName: this.logicalStackName,
      tags: props.sharedTags,
    })

    // Reference: https://github.com/rehanvdm/serverless-website-analytics
    const swa = new Swa(this, 'serverless-analytics', {
      allowedOrigins: ['https://wheelerrecommends.com'],
      anomaly: {
        alert: {
          topic: snsTopic
        }
      },
      awsEnv: {
        account: this.account,
        region: this.region,
      },
      environment: 'prod',
      firehoseBufferInterval: 900,
      observability: {
        dashboard: true,
        alarms: {
          alarmTopic: snsTopic,
          alarmTypes: AllAlarmTypes
        },
      },
      isDemoPage: false,
      rateLimit: {
        frontLambdaConcurrency: 20,  // default 100; as of 2024-07-01
        ingestLambdaConcurrency: 40, // default 200; as of 2024-07-01
      },
      sites: [
        'wheelerrecommends.com',
      ],
    });
    applyTags({
      resource: swa,
      resourceName: 'Swa',
      stackName: this.logicalStackName,
      tags: props.sharedTags,
    });
  }
}