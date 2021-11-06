import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';
import { HttpMethod, HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

interface HttpResourceProps {
    httpApi: HttpApi,
    identifier: string,
    handler: string,
    code: lambda.AssetCode,
    layers: lambda.LayerVersion[],
    path: string,
    methods: HttpMethod[],
    variables?: any,
};

export class HttpResource extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: HttpResourceProps) {
    super(scope, id);

        const httpLambda = new lambda.Function(scope, props.identifier, {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: props.handler,
            code: props.code,
            layers: props.layers,
            environment: {
                ...props.variables,
            }
        });

        props.httpApi.addRoutes({
            path: props.path,
            methods: props.methods,
            integration: new LambdaProxyIntegration({
                handler: httpLambda,
            }),
        });

  };
};
