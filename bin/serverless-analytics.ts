#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ServerlessAnalyticsStack} from '../lib/serverless-analytics-stack';
import {Tags} from 'aws-cdk-lib';

const environmentName = 'productionA';
const serviceName = 'ServerlessAnalyticsStack';

const app = new cdk.App();
const swaStack = new ServerlessAnalyticsStack(app, 'serverless-analytics', {
  env: {
    account: '590183969109',
    region: 'us-east-2',
  },
  tags: {
    'Environment': environmentName,
    'Service': serviceName
  }
});

Tags.of(swaStack).add('Environment', environmentName);
Tags.of(swaStack).add('Name', `${environmentName}/${serviceName}`);
Tags.of(swaStack).add('Service', serviceName);