import * as cdk from 'aws-cdk-lib';
import {Construct, IConstruct} from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import {AllAlarmTypes, Swa} from 'serverless-website-analytics';
import {Tags} from 'aws-cdk-lib';

export class ServerlessAnalyticsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const snsTopic = new sns.Topic(this, 'alarm-topic');
    this.addTags({
      name: 'SnsTopic',
      resource: snsTopic,
      tags: props?.tags,
    })

    const snsSubscription = new sns.Subscription(this, 'alarm-topic-subscription', {
      topic: snsTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: 'justin.wheeler@wheeleruniverse.com',
    });
    this.addTags({
      name: 'SnsSubscription',
      resource: snsSubscription,
      tags: props?.tags,
    })

    const swa = new Swa(this, 'serverless-analytics', {
      allowedOrigins: ['https://wheelerrecommends.com'],
      awsEnv: {
        account: this.account,
        region: this.region,
      },
      environment: 'prod',
      observability: {
        dashboard: true,
        alarms: {
          alarmTopic: snsTopic,
          alarmTypes: AllAlarmTypes
        },
      },
      isDemoPage: false,
      sites: [
        'wheelerrecommends.com',
      ],
    });
    this.addTags({
      name: 'Swa',
      resource: swa,
      tags: props?.tags
    });
  }

  private addTags({name, resource, tags}: {
    name: string,
    resource: IConstruct,
    tags?: { [p: string]: string } | undefined
  }): void {
    const environmentName = tags?.['Environment'];
    if (environmentName) {
      Tags.of(resource).add('Environment', environmentName);
    }

    const parent = tags?.['Service'];
    Tags.of(resource).add('Name', parent ? `${parent}/${name}` : name);
    Tags.of(resource).add('Service', name);
  }
}