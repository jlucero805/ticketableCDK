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
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
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
        /**
         * GET POST
         * /projects/{projectId}/tickets
         */
        new httpResource_construct_1.HttpResource(this, 'project-tickets-resource', {
            httpApi: httpApi,
            identifier: 'project-tickets-lambda',
            handler: 'projectTickets.handler',
            code: lambda.Code.fromAsset('lambda/projects'),
            layers: baseLayers,
            path: '/projects/{projectId}/tickets',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0dGFibGVfY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGlja2V0dGFibGVfY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnRUFBZ0Y7QUFDaEYsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsa0RBQWtEO0FBQ2xELHFFQUF3RDtBQUd4RCxNQUFhLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsbUJBQW1CO1FBQ25CLG1CQUFtQjtRQUNuQixtQkFBbUI7UUFFbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtZQUM5QyxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDNUYsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3ZGLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUM3QixnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsT0FBTyxFQUFFLEtBQUs7WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMs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aEIsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUM3QyxNQUFNLEVBQUUsVUFBVTtZQUNsQixJQUFJLEVBQUUsOEJBQThCO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCw2QkFBVSxDQUFDLEdBQUc7Z0JBQ2QsNkJBQVUsQ0FBQyxJQUFJO2FBQ2hCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO1FBRUg7OztXQUdHO1FBQ0gsSUFBSSxxQ0FBWSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNqRCxPQUFPLEVBQUUsT0FBTztZQUNoQixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLE9BQU8sRUFBRSx3QkFBd0I7WUFDakMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1lBQzlDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLElBQUksRUFBRSwrQkFBK0I7WUFDckMsT0FBTyxFQUFFO2dCQUNQLDZCQUFVLENBQUMsR0FBRztnQkFDZCw2QkFBVSxDQUFDLElBQUk7YUFDaEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDM0I7U0FDRixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUFoTUQsa0RBZ01DO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvcnNIdHRwTWV0aG9kLCBIdHRwQXBpLCBIdHRwTWV0aG9kIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnQGF3cy1jZGsvYXdzLXJkcyc7XG5pbXBvcnQgKiBhcyBzbSBmcm9tICdAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0IHsgSHR0cFJlc291cmNlIH0gZnJvbSAnLi9odHRwUmVzb3VyY2UtY29uc3RydWN0JztcblxuXG5leHBvcnQgY2xhc3MgVGlja2V0dGFibGVDZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyAjIyMjIyMjIyMjIyMjIyMjXG4gICAgLy8gIyMjIERhdGFiYXNlICMjI1xuICAgIC8vICMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0IGRiID0gbmV3IHJkcy5EYXRhYmFzZUluc3RhbmNlKHRoaXMsICdkYicsIHtcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlSW5zdGFuY2VFbmdpbmUucG9zdGdyZXMoeyB2ZXJzaW9uOiByZHMuUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xM180IH0pLFxuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTMsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgdnBjOiBuZXcgZWMyLlZwYyh0aGlzLCBcIlZQQ1wiKSxcbiAgICAgIGFsbG9jYXRlZFN0b3JhZ2U6IDIwLFxuICAgICAgbWF4QWxsb2NhdGVkU3RvcmFnZTogMzAsXG4gICAgICBtdWx0aUF6OiBmYWxzZSxcbiAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGRiLmNvbm5lY3Rpb25zLmFsbG93RGVmYXVsdFBvcnRGcm9tQW55SXB2NCgnJyk7XG5cbiAgICAvLyAjIyMjIyMjIyMjIyMjIyMjXG4gICAgLy8gIyMjIEh0dHAgQXBpICMjI1xuICAgIC8vICMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0IGh0dHBBcGkgPSBuZXcgSHR0cEFwaSh0aGlzLCAnaHR0cCcsIHtcbiAgICAgIGNvcnNQcmVmbGlnaHQ6IHtcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBbXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgJ1gtQW16LURhdGUnLFxuICAgICAgICAgICdBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICAnWC1BcGktS2V5JyxcbiAgICAgICAgXSxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBbXG4gICAgICAgICAgQ29yc0h0dHBNZXRob2QuR0VULFxuICAgICAgICAgIENvcnNIdHRwTWV0aG9kLlBPU1QsXG4gICAgICAgICAgQ29yc0h0dHBNZXRob2QuUFVULFxuICAgICAgICAgIENvcnNIdHRwTWV0aG9kLkRFTEVURSxcbiAgICAgICAgXSxcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBbJyonXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBSRFNfUEFTUyA9IHNtLlNlY3JldC5mcm9tU2VjcmV0QXR0cmlidXRlcyh0aGlzLCAncmRzLXBhc3Mtc2VjcmV0Jywge1xuICAgICAgc2VjcmV0Q29tcGxldGVBcm46ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMTowMjY2MjYzMjgzODk6c2VjcmV0OlJEU19QQVNTLThBemk2dCcsXG4gICAgfSkuc2VjcmV0VmFsdWU7XG5cbiAgICAvLyAjIyMjIyMjIyMjIyMjI1xuICAgIC8vICMjIyBMYXllcnMgIyMjXG4gICAgLy8gIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0IHBnTGF5ZXIgPSBuZXcgbGFtYmRhLkxheWVyVmVyc2lvbih0aGlzLCAncGctbGF5ZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCJsYXllcnMvcGdcIiksXG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IFsgbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1ggXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRiTGF5ZXIgPSBuZXcgbGFtYmRhLkxheWVyVmVyc2lvbih0aGlzLCAnZGItbGF5ZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCJsYXllcnMvcGdkYlwiKSxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogWyBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXRpbHMgPSBuZXcgbGFtYmRhLkxheWVyVmVyc2lvbih0aGlzLCAndXRpbHMtbGF5ZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCJsYXllcnMvdXRpbHNcIiksXG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IFsgbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1ggXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJhc2VMYXllcnMgPSBbdXRpbHMsIHBnTGF5ZXIsIGRiTGF5ZXJdO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBPU1RcbiAgICAgKiAvbWVtYmVyc1xuICAgICAqL1xuICAgIG5ldyBIdHRwUmVzb3VyY2UodGhpcywgJ21lbWJlcnMtcmVzb3VyY2UnLCB7XG4gICAgICBodHRwQXBpOiBodHRwQXBpLFxuICAgICAgaWRlbnRpZmllcjogJ21lbWJlcnMtbGFtYmRhJyxcbiAgICAgIGhhbmRsZXI6ICdtZW1iZXJzLmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEvbWVtYmVycycpLFxuICAgICAgbGF5ZXJzOiBiYXNlTGF5ZXJzLFxuICAgICAgcGF0aDogJy9tZW1iZXJzJyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUE9TVCxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBHRVQgUFVUIERFTEVURVxuICAgICAqIC9tZW1iZXJzL3ttZW1iZXJJZH1cbiAgICAgKi9cbiAgICBuZXcgSHR0cFJlc291cmNlKHRoaXMsICdtZW1iZXItcmVzb3VyY2UnLCB7XG4gICAgICBodHRwQXBpOiBodHRwQXBpLFxuICAgICAgaWRlbnRpZmllcjogJ21lbWJlci1sYW1iZGEnLFxuICAgICAgaGFuZGxlcjogJ21lbWJlci5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhL21lbWJlcnMnKSxcbiAgICAgIGxheWVyczogYmFzZUxheWVycyxcbiAgICAgIHBhdGg6ICcvbWVtYmVycy97bWVtYmVySWR9JyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUFVULFxuICAgICAgICBIdHRwTWV0aG9kLkRFTEVURSxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBHRVQgUE9TVFxuICAgICAqIC9vcmdzXG4gICAgICovXG4gICAgbmV3IEh0dHBSZXNvdXJjZSh0aGlzLCAnb3Jncy1yZXNvdXJjZScsIHtcbiAgICAgIGh0dHBBcGk6IGh0dHBBcGksXG4gICAgICBpZGVudGlmaWVyOiAnb3Jncy1sYW1iZGEnLFxuICAgICAgaGFuZGxlcjogJ29yZ3MuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS9vcmdzJyksXG4gICAgICBsYXllcnM6IGJhc2VMYXllcnMsXG4gICAgICBwYXRoOiAnL29yZ3MnLFxuICAgICAgbWV0aG9kczogW1xuICAgICAgICBIdHRwTWV0aG9kLkdFVCxcbiAgICAgICAgSHR0cE1ldGhvZC5QT1NULFxuICAgICAgXSxcbiAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICBSRFNfUEFTUzogU3RyaW5nKFJEU19QQVNTKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBHRVQgUFVUIERFTEVURVxuICAgICAqIC9vcmdzL3tvcmdJZH1cbiAgICAgKi9cbiAgICBuZXcgSHR0cFJlc291cmNlKHRoaXMsICdvcmctcmVzb3VyY2UnLCB7XG4gICAgICBodHRwQXBpOiBodHRwQXBpLFxuICAgICAgaWRlbnRpZmllcjogJ29yZy1sYW1iZGEnLFxuICAgICAgaGFuZGxlcjogJ29yZy5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhL29yZ3MnKSxcbiAgICAgIGxheWVyczogYmFzZUxheWVycyxcbiAgICAgIHBhdGg6ICcvb3Jncy97b3JnSWR9JyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUFVULFxuICAgICAgICBIdHRwTWV0aG9kLkRFTEVURSxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBPU1RcbiAgICAgKiAvbWVtYmVycy97bWVtYmVySWR9L3Byb2plY3RzXG4gICAgICovXG4gICAgbmV3IEh0dHBSZXNvdXJjZSh0aGlzLCAnbWVtYmVyLXByb2plY3RzLXJlc291cmNlJywge1xuICAgICAgaHR0cEFwaTogaHR0cEFwaSxcbiAgICAgIGlkZW50aWZpZXI6ICdtZW1iZXItcHJvamVjdHMtbGFtYmRhJyxcbiAgICAgIGhhbmRsZXI6ICdtZW1iZXJQcm9qZWN0cy5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhL21lbWJlcnMnKSxcbiAgICAgIGxheWVyczogYmFzZUxheWVycyxcbiAgICAgIHBhdGg6ICcvbWVtYmVycy97bWVtYmVySWR9L3Byb2plY3RzJyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUE9TVCxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR0VUIFBPU1RcbiAgICAgKiAvcHJvamVjdHMve3Byb2plY3RJZH0vdGlja2V0c1xuICAgICAqL1xuICAgIG5ldyBIdHRwUmVzb3VyY2UodGhpcywgJ3Byb2plY3QtdGlja2V0cy1yZXNvdXJjZScsIHtcbiAgICAgIGh0dHBBcGk6IGh0dHBBcGksXG4gICAgICBpZGVudGlmaWVyOiAncHJvamVjdC10aWNrZXRzLWxhbWJkYScsXG4gICAgICBoYW5kbGVyOiAncHJvamVjdFRpY2tldHMuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS9wcm9qZWN0cycpLFxuICAgICAgbGF5ZXJzOiBiYXNlTGF5ZXJzLFxuICAgICAgcGF0aDogJy9wcm9qZWN0cy97cHJvamVjdElkfS90aWNrZXRzJyxcbiAgICAgIG1ldGhvZHM6IFtcbiAgICAgICAgSHR0cE1ldGhvZC5HRVQsXG4gICAgICAgIEh0dHBNZXRob2QuUE9TVCxcbiAgICAgIF0sXG4gICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgUkRTX1BBU1M6IFN0cmluZyhSRFNfUEFTUyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH1cbn07XG4iXX0=