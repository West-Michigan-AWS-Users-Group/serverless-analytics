#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ServerlessAnalyticsStack} from '../lib/stacks/serverless-analytics-stack';

const app = new cdk.App();

new ServerlessAnalyticsStack(app, 'serverless-analytics', {
  env: {
    account: '590183969109',
    region: 'us-east-2',
  },
  sharedTags: {
    'Environment': 'productionA',
  }
});