import * as cdk from '@aws-cdk/core';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as sm from '@aws-cdk/aws-secretsmanager';
import { HttpResource } from './httpResource-construct';


export class TickettableCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ################
    // ### Database ###
    // ################

    const db = new rds.DatabaseInstance(this, 'db', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13_4 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      vpc: new ec2.Vpc(this, "VPC"),
      allocatedStorage: 20,
      maxAllocatedStorage: 30,
      multiAz: false,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    db.connections.allowDefaultPortFromAnyIpv4('');

    // ################
    // ### Http Api ###
    // ################

    const httpApi = new HttpApi(this, 'http', {
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.DELETE,
        ],
        allowOrigins: ['*'],
      },
    });

    const RDS_PASS = sm.Secret.fromSecretAttributes(this, 'rds-pass-secret', {
      secretCompleteArn: 'arn:aws:secretsmanager:us-west-1:026626328389:secret:RDS_PASS-8Azi6t',
    }).secretValue;

    const pgLayer = new lambda.LayerVersion(this, 'pg-layer', {
      code: lambda.Code.fromAsset("layers/pg"),
      compatibleRuntimes: [ lambda.Runtime.NODEJS_14_X ],
    });

    const dbLayer = new lambda.LayerVersion(this, 'db-layer', {
      code: lambda.Code.fromAsset("layers/pgdb"),
      compatibleRuntimes: [ lambda.Runtime.NODEJS_14_X ],
    });

    /**
     * GET POST
     * /members
     */
    new HttpResource(this, 'members-resource', {
      httpApi: httpApi,
      identifier: 'members-lambda',
      handler: 'members.handler',
      code: lambda.Code.fromAsset('lambda'),
      layers: [ pgLayer, dbLayer ],
      path: '/members',
      methods: [
        HttpMethod.GET,
        HttpMethod.POST,
      ],
      variables: {
        RDS_PASS: String(RDS_PASS),
      }
    });

    /**
     * GET PUT DELETE
     * /members/{memberId}
     */
    new HttpResource(this, 'member-resource', {
      httpApi: httpApi,
      identifier: 'member-lambda',
      handler: 'member.handler',
      code: lambda.Code.fromAsset('lambda'),
      layers: [ pgLayer, dbLayer ],
      path: '/members/{memberId}',
      methods: [
        HttpMethod.GET,
        HttpMethod.PUT,
        HttpMethod.DELETE,
      ],
      variables: {
        RDS_PASS: String(RDS_PASS),
      }
    });

  }
};
