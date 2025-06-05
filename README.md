# ECS Deployment Check

This check ensures that the last deployment to ECS was successful and not rolled
back to a previous version.

## Required Parameters

- ecs-cluster: The ECS cluster where the service is running.
- ecs-service: The ECS service to verify.
- aws-region: The AWS region of your ECS deployment.

## How It Works

This script utilizes the AWS CLI to retrieve the current deployment details from
Amazon ECS. It verifies that the most recent deployment is successful. If the
deployment has been rolled back to a previous version, the check will flag the
issue.

## Usage in a Workflow

Integrate this check into your CI/CD pipeline. For example:

```yaml
steps:
  - name: Deploy Amazon ECS task definition
    uses: aws-actions/amazon-ecs-deploy-task-definition@v1
    with:
      task-definition: ${{ steps.task-def.outputs.task-definition }}
      cluster: ${{ inputs.ecs-cluster }}
      service: ${{ inputs.ecs-service }}
      force-new-deployment: true
      wait-for-service-stability: true

  - name: Check ECS deployment
    uses: 15gifts/ecs-check-latest-deployment@v1
    with:
      ecs-cluster: ${{ inputs.ecs-cluster }}
      ecs-service: ${{ inputs.ecs-service }}
      aws-region: ${{ inputs.aws-region }}
```

## Next Steps

1. Ensure that your AWS credentials are securely configured in your environment.
2. Run this check after each deployment to safeguard against unintended
   rollbacks.
