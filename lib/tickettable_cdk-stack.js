"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickettableCdkStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_apigatewayv2_1 = require("@aws-cdk/aws-apigatewayv2");
const lambda = require("@aws-cdk/aws-lambda");
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require("@aws-cdk/aws-rds");
const sm = require("@aws-cdk/aws-secretsmanager");
const httpResource_construct_1 = require("./httpResource-construct");
class TickettableCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        const httpApi = new aws_apigatewayv2_1.HttpApi(this, 'http', {
            corsPreflight: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: [
                    aws_apigatewayv2_1.CorsHttpMethod.GET,
                    aws_apigatewayv2_1.CorsHttpMethod.POST,
                    aws_apigatewayv2_1.CorsHttpMethod.PUT,
                    aws_apigatewayv2_1.CorsHttpMethod.DELETE,
                ],
                allowOrigins: ['*'],
            },
        });
        const RDS_PASS = sm.Secret.fromSecretAttributes(this, 'rds-pass-secret', {
            secretCompleteArn: 'arn:aws:secretsmanager:us-west-1:026626328389:secret:RDS_PASS-8Azi6t',
        }).secretValue;
        // ##############
        // ### Layers ###
        // ##############
        const pgLayer = new lambda.LayerVersion(this, 'pg-layer', {
            code: lambda.Code.fromAsset("layers/pg"),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        const dbLayer = new lambda.LayerVersion(this, 'db-layer', {
            code: lambda.Code.fromAsset("layers/pgdb"),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        const utils = new lambda.LayerVersion(this, 'utils-layer', {
            code: lambda.Code.fromAsset("layers/utils"),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        const baseLayers = [utils, pgLayer, dbLayer];
        /**
         * GET POST
         * /members
         */
        new httpResource_construct_1.HttpResource(this, 'members-resource', {
            httpApi: httpApi,
            identifier: 'members-lambda',
            handler: 'members.handler',
            code: lambda.Code.fromAsset('lambda/members'),
            layers: baseLayers,
            path: '/members',
            methods: [
                aws_apigatewayv2_1.HttpMethod.GET,
                aws_apigatewayv2_1.HttpMethod.POST,
            ],
            variables: {
                RDS_PASS: String(RDS_PASS),
            }
        });
        /**
         * GET PUT DELETE
         * /members/{memberId}
         */
        new httpResource_construct_1.HttpResource(this, 'member-resource', {
            httpApi: httpApi,
            identifier: 'member-lambda',
            handler: 'member.handler',
            code: lambda.Code.fromAsset('lambda/members'),
            layers: baseLayers,
            path: '/members/{memberId}',
            methods: [
                aws_apigatewayv2_1.HttpMethod.GET,
                aws_apigatewayv2_1.HttpMethod.PUT,
                aws_apigatewayv2_1.HttpMethod.DELETE,
            ],
            variables: {
                RDS_PASS: String(RDS_PASS),
            }
        });
        /**
         * GET POST
         * /orgs
         */
        new httpResource_construct_1.HttpResource(this, 'orgs-resource', {
            httpApi: httpApi,
            identifier: 'orgs-lambda',
            handler: 'orgs.handler',
            code: lambda.Code.fromAsset('lambda/orgs'),
            layers: baseLayers,
            path: '/orgs',
            methods: [
                aws_apigatewayv2_1.HttpMethod.GET,
                aws_apigatewayv2_1.HttpMethod.POST,
            ],
            variables: {
                RDS_PASS: String(RDS_PASS),
            },
        });
        /**
         * GET PUT DELETE
         * /orgs/{orgId}
         */
        new httpResource_construct_1.HttpResource(this, 'org-resource', {
            httpApi: httpApi,
            identifier: 'org-lambda',
            handler: 'org.handler',
            code: lambda.Code.fromAsset('lambda/orgs'),
            layers: baseLayers,
            path: '/orgs/{orgId}',
            methods: [
                aws_apigatewayv2_1.HttpMethod.GET,
                aws_apigatewayv2_1.HttpMethod.PUT,
                aws_apigatewayv2_1.HttpMethod.DELETE,
            ],
            variables: {
                RDS_PASS: String(RDS_PASS),
            },
        });
        /**
         * GET POST
         * /members/{memberId}/projects
         */
        new httpResource_construct_1.HttpResource(this, 'member-projects-resource', {
            httpApi: httpApi,
            identifier: 'member-projects-lambda',
            handler: 'memberProjects.handler',
            code: lambda.Code.fromAsset('lambda/members'),
            layers: baseLayers,
            path: '/members/{memberId}/projects',
            methods: [
                aws_apigatewayv2_1.HttpMethod.GET,
                aws_apigatewayv2_1.HttpMethod.POST,
            ],
            variables: {
                RDS_PASS: String(RDS_PASS),
            },
        });
    }
}
exports.TickettableCdkStack = TickettableCdkStack;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0dGFibGVfY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGlja2V0dGFibGVfY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnRUFBZ0Y7QUFDaEYsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsa0RBQWtEO0FBQ2xELHFFQUF3RDtBQUd4RCxNQUFhLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsbUJBQW1CO1FBQ25CLG1CQUFtQjtRQUNuQixtQkFBbUI7UUFFbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtZQUM5QyxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDNUYsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3ZGLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUM3QixnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsT0FBTyxFQUFFLEtBQUs7WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMs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aEIsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUM3QyxNQUFNLEVBQUUsVUFBVTtZQUNsQixJQUFJLEVBQUUsOEJBQThCO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCw2QkFBVSxDQUFDLEdBQUc7Z0JBQ2QsNkJBQVUsQ0FBQyxJQUFJO2FBQ2hCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBNUtELGtEQTRLQztBQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JzSHR0cE1ldGhvZCwgSHR0cEFwaSwgSHR0cE1ldGhvZCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgcmRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yZHMnO1xuaW1wb3J0ICogYXMgc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCB7IEh0dHBSZXNvdXJjZSB9IGZyb20gJy4vaHR0cFJlc291cmNlLWNvbnN0cnVjdCc7XG5cblxuZXhwb3J0IGNsYXNzIFRpY2tldHRhYmxlQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gIyMjIyMjIyMjIyMjIyMjI1xuICAgIC8vICMjIyBEYXRhYmFzZSAjIyNcbiAgICAvLyAjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdCBkYiA9IG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZSh0aGlzLCAnZGInLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLnBvc3RncmVzKHsgdmVyc2lvbjogcmRzLlBvc3RncmVzRW5naW5lVmVyc2lvbi5WRVJfMTNfNCB9KSxcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUzLCBlYzIuSW5zdGFuY2VTaXplLlNNQUxMKSxcbiAgICAgIHZwYzogbmV3IGVjMi5WcGModGhpcywgXCJWUENcIiksXG4gICAgICBhbGxvY2F0ZWRTdG9yYWdlOiAyMCxcbiAgICAgIG1heEFsbG9jYXRlZFN0b3JhZ2U6IDMwLFxuICAgICAgbXVsdGlBejogZmFsc2UsXG4gICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBkYi5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoJycpO1xuXG4gICAgLy8gIyMjIyMjIyMjIyMjIyMjI1xuICAgIC8vICMjIyBIdHRwIEFwaSAjIyNcbiAgICAvLyAjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdCBodHRwQXBpID0gbmV3IEh0dHBBcGkodGhpcywgJ2h0dHAnLCB7XG4gICAgICBjb3JzUHJlZmxpZ2h0OiB7XG4gICAgICAgIGFsbG93SGVhZGVyczogW1xuICAgICAgICAgICdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICdYLUFtei1EYXRlJyxcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbicsXG4gICAgICAgICAgJ1gtQXBpLUtleScsXG4gICAgICAgIF0sXG4gICAgICAgIGFsbG93TWV0aG9kczogW1xuICAgICAgICAgIENvcnNIdHRwTWV0aG9kLkdFVCxcbiAgICAgICAgICBDb3JzSHR0cE1ldGhvZC5QT1NULFxuICAgICAgICAgIENvcnNIdHRwTWV0aG9kLlBVVCxcbiAgICAgICAgICBDb3JzSHR0cE1ldGhvZC5ERUxFVEUsXG4gICAgICAgIF0sXG4gICAgICAgIGFsbG93T3JpZ2luczogWycqJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgUkRTX1BBU1MgPSBzbS5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXModGhpcywgJ3Jkcy1wYXNzLXNlY3JldCcsIHtcbiAgICAgIHNlY3JldENvbXBsZXRlQXJuOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTE6MDI2NjI2MzI4Mzg5OnNlY3JldDpSRFNfUEFTUy04QXppNnQnLFxuICAgIH0pLnNlY3JldFZhbHVlO1xuXG4gICAgLy8gIyMjIyMjIyMjIyMjIyNcbiAgICAvLyAjIyMgTGF5ZXJzICMjI1xuICAgIC8vICMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdCBwZ0xheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24odGhpcywgJ3BnLWxheWVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFwibGF5ZXJzL3BnXCIpLFxuICAgICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBbIGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYkxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24odGhpcywgJ2RiLWxheWVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFwibGF5ZXJzL3BnZGJcIiksXG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IFsgbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1ggXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHV0aWxzID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24odGhpcywgJ3V0aWxzLWxheWVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFwibGF5ZXJzL3V0aWxzXCIpLFxuICAgICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBbIGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBiYXNlTGF5ZXJzID0gW3V0aWxzLCBwZ0xheWVyLCBkYkxheWVyXTtcblxuICAgIC8qKlxuICAgICAqIEdFVCBQT1NUXG4gICAgICogL21lbWJlcnNcbiAgICAgKi9cbiAgICBuZXcgSHR0cFJlc291cmNlKHRoaXMsICdtZW1iZXJzLXJlc291cmNlJywge1xuICAgICAgaHR0cEFwaTogaHR0cEFwaSxcbiAgICAgIGlkZW50aWZpZXI6ICdtZW1iZXJzLWxhbWJkYScsXG4gICAgICBoYW5kbGVyOiAnbWVtYmVycy5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhL21lbWJlcnMnKSxcbiAgICAgIGxheWVyczogYmFzZUxheWVycyxcbiAgICAgIHBhdGg6ICcvbWVtYmVycycsXG4gICAgICBtZXRob2RzOiBbXG4gICAgICAgIEh0dHBNZXRob2QuR0VULFxuICAgICAgICBIdHRwTWV0aG9kLlBPU1QsXG4gICAgICBdLFxuICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgIFJEU19QQVNTOiBTdHJpbmcoUkRTX1BBU1MpLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBVVCBERUxFVEVcbiAgICAgKiAvbWVtYmVycy97bWVtYmVySWR9XG4gICAgICovXG4gICAgbmV3IEh0dHBSZXNvdXJjZSh0aGlzLCAnbWVtYmVyLXJlc291cmNlJywge1xuICAgICAgaHR0cEFwaTogaHR0cEFwaSxcbiAgICAgIGlkZW50aWZpZXI6ICdtZW1iZXItbGFtYmRhJyxcbiAgICAgIGhhbmRsZXI6ICdtZW1iZXIuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS9tZW1iZXJzJyksXG4gICAgICBsYXllcnM6IGJhc2VMYXllcnMsXG4gICAgICBwYXRoOiAnL21lbWJlcnMve21lbWJlcklkfScsXG4gICAgICBtZXRob2RzOiBbXG4gICAgICAgIEh0dHBNZXRob2QuR0VULFxuICAgICAgICBIdHRwTWV0aG9kLlBVVCxcbiAgICAgICAgSHR0cE1ldGhvZC5ERUxFVEUsXG4gICAgICBdLFxuICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgIFJEU19QQVNTOiBTdHJpbmcoUkRTX1BBU1MpLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBPU1RcbiAgICAgKiAvb3Jnc1xuICAgICAqL1xuICAgIG5ldyBIdHRwUmVzb3VyY2UodGhpcywgJ29yZ3MtcmVzb3VyY2UnLCB7XG4gICAgICBodHRwQXBpOiBodHRwQXBpLFxuICAgICAgaWRlbnRpZmllcjogJ29yZ3MtbGFtYmRhJyxcbiAgICAgIGhhbmRsZXI6ICdvcmdzLmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEvb3JncycpLFxuICAgICAgbGF5ZXJzOiBiYXNlTGF5ZXJzLFxuICAgICAgcGF0aDogJy9vcmdzJyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUE9TVCxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBVVCBERUxFVEVcbiAgICAgKiAvb3Jncy97b3JnSWR9XG4gICAgICovXG4gICAgbmV3IEh0dHBSZXNvdXJjZSh0aGlzLCAnb3JnLXJlc291cmNlJywge1xuICAgICAgaHR0cEFwaTogaHR0cEFwaSxcbiAgICAgIGlkZW50aWZpZXI6ICdvcmctbGFtYmRhJyxcbiAgICAgIGhhbmRsZXI6ICdvcmcuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS9vcmdzJyksXG4gICAgICBsYXllcnM6IGJhc2VMYXllcnMsXG4gICAgICBwYXRoOiAnL29yZ3Mve29yZ0lkfScsXG4gICAgICBtZXRob2RzOiBbXG4gICAgICAgIEh0dHBNZXRob2QuR0VULFxuICAgICAgICBIdHRwTWV0aG9kLlBVVCxcbiAgICAgICAgSHR0cE1ldGhvZC5ERUxFVEUsXG4gICAgICBdLFxuICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgIFJEU19QQVNTOiBTdHJpbmcoUkRTX1BBU1MpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEdFVCBQT1NUXG4gICAgICogL21lbWJlcnMve21lbWJlcklkfS9wcm9qZWN0c1xuICAgICAqL1xuICAgIG5ldyBIdHRwUmVzb3VyY2UodGhpcywgJ21lbWJlci1wcm9qZWN0cy1yZXNvdXJjZScsIHtcbiAgICAgIGh0dHBBcGk6IGh0dHBBcGksXG4gICAgICBpZGVudGlmaWVyOiAnbWVtYmVyLXByb2plY3RzLWxhbWJkYScsXG4gICAgICBoYW5kbGVyOiAnbWVtYmVyUHJvamVjdHMuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS9tZW1iZXJzJyksXG4gICAgICBsYXllcnM6IGJhc2VMYXllcnMsXG4gICAgICBwYXRoOiAnL21lbWJlcnMve21lbWJlcklkfS9wcm9qZWN0cycsXG4gICAgICBtZXRob2RzOiBbXG4gICAgICAgIEh0dHBNZXRob2QuR0VULFxuICAgICAgICBIdHRwTWV0aG9kLlBPU1QsXG4gICAgICBdLFxuICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgIFJEU19QQVNTOiBTdHJpbmcoUkRTX1BBU1MpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9XG59O1xuIl19