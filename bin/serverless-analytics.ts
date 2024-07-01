#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessAnalyticsStack } from '../lib/serverless-analytics-stack';
import {Tags} from "aws-cdk-lib";

const app = new cdk.App();

const swaStack = new ServerlessAnalyticsStack(app, 'serverless-analytics', {
  env: {
    account: '590183969109',
    region: 'us-east-2',
  },
});

Tags.of(swaStack).add('App', 'serverless-analytics');