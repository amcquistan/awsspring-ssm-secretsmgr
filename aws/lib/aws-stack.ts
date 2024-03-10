import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDriver } from "aws-cdk-lib/aws-ecs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const shortNameParamPath = "/config/awsspringdemo/my.short-name";
    const fullNameSecretId = "awsspringdemo";

    const shortNameParam = new StringParameter(this, 'ShortNameParam', {
      stringValue: "Adam M.",
      parameterName: shortNameParamPath
    });

    const fullNameSecret = new Secret(this, 'FullNameSecret', {
      secretName: fullNameSecretId,
      generateSecretString: {
        generateStringKey: 'my.full-name',
        secretStringTemplate: JSON.stringify({})
      }
    });

    const fargate = new Cluster(this, "FargateCluster");

    const taskDef = new FargateTaskDefinition(this, "FargateTaskDef");
    taskDef.addContainer('app', {
      image: ContainerImage.fromAsset("../awsspringdemo"),
      logging: LogDriver.awsLogs({streamPrefix:'app'}),
    });

    taskDef.taskRole.addToPrincipalPolicy(new PolicyStatement({
      actions: [ 'ssm:Get*' ],
      effect: Effect.ALLOW,
      resources: [ '*' ]
    }));

    taskDef.taskRole.addToPrincipalPolicy(new PolicyStatement({
      actions: [ 'secretsmanager:Get*' ],
      effect: Effect.ALLOW,
      resources: [ '*' ]
    }));

    const fargetSvc = new FargateService(this, 'FargateSvc', {
      cluster: fargate,
      taskDefinition: taskDef
    });
  }
}
