"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResource = void 0;
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const aws_apigatewayv2_integrations_1 = require("@aws-cdk/aws-apigatewayv2-integrations");
;
class HttpResource extends cdk.Construct {
    constructor(scope, id, props) {
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
            integration: new aws_apigatewayv2_integrations_1.LambdaProxyIntegration({
                handler: httpLambda,
            }),
        });
    }
    ;
}
exports.HttpResource = HttpResource;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlc291cmNlLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHBSZXNvdXJjZS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQW9DO0FBQ3BDLDhDQUE4QztBQUU5QywwRkFBZ0Y7QUFXL0UsQ0FBQztBQUVGLE1BQWEsWUFBYSxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBQzdDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUViLE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUM1RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFdBQVcsRUFBRTtnQkFDVCxHQUFHLEtBQUssQ0FBQyxTQUFTO2FBQ3JCO1NBQ0osQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixXQUFXLEVBQUUsSUFBSSxzREFBc0IsQ0FBQztnQkFDcEMsT0FBTyxFQUFFLFVBQVU7YUFDdEIsQ0FBQztTQUNMLENBQUMsQ0FBQztJQUVULENBQUM7SUFBQSxDQUFDO0NBQ0g7QUF2QkQsb0NBdUJDO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJ1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgSHR0cE1ldGhvZCwgSHR0cEFwaSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djInO1xuaW1wb3J0IHsgTGFtYmRhUHJveHlJbnRlZ3JhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djItaW50ZWdyYXRpb25zJztcblxuaW50ZXJmYWNlIEh0dHBSZXNvdXJjZVByb3BzIHtcbiAgICBodHRwQXBpOiBIdHRwQXBpLFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBoYW5kbGVyOiBzdHJpbmcsXG4gICAgY29kZTogbGFtYmRhLkFzc2V0Q29kZSxcbiAgICBsYXllcnM6IGxhbWJkYS5MYXllclZlcnNpb25bXSxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgbWV0aG9kczogSHR0cE1ldGhvZFtdLFxuICAgIHZhcmlhYmxlcz86IGFueSxcbn07XG5cbmV4cG9ydCBjbGFzcyBIdHRwUmVzb3VyY2UgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBIdHRwUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgY29uc3QgaHR0cExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc2NvcGUsIHByb3BzLmlkZW50aWZpZXIsIHtcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICAgICAgaGFuZGxlcjogcHJvcHMuaGFuZGxlcixcbiAgICAgICAgICAgIGNvZGU6IHByb3BzLmNvZGUsXG4gICAgICAgICAgICBsYXllcnM6IHByb3BzLmxheWVycyxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgLi4ucHJvcHMudmFyaWFibGVzLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wcy5odHRwQXBpLmFkZFJvdXRlcyh7XG4gICAgICAgICAgICBwYXRoOiBwcm9wcy5wYXRoLFxuICAgICAgICAgICAgbWV0aG9kczogcHJvcHMubWV0aG9kcyxcbiAgICAgICAgICAgIGludGVncmF0aW9uOiBuZXcgTGFtYmRhUHJveHlJbnRlZ3JhdGlvbih7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogaHR0cExhbWJkYSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcblxuICB9O1xufTtcbiJdfQ==