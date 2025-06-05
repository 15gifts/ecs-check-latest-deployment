import * as core from '@actions/core'
import { ECS } from '@aws-sdk/client-ecs'

export interface CommandOptions {
  dryRun: boolean
  ecsCluster: string
  ecsService: string
  awsRegion: string
}

export async function execute(options: CommandOptions): Promise<void> {
  if (options.dryRun) {
    core.info('All fine, nothing to see here')
    return
  }

  process.env.AWS_REGION = options.awsRegion

  const ecs = new ECS()
  const deployments = await ecs.listServiceDeployments({
    cluster: options.ecsCluster,
    service: options.ecsService
  })

  if (
    deployments.serviceDeployments &&
    deployments.serviceDeployments.length > 0
  ) {
    const latest = deployments.serviceDeployments[0]
    const date = latest.finishedAt?.toLocaleDateString('en-GB')
    const time = latest.finishedAt?.toLocaleTimeString('en-GB')
    core.debug(`serviceDeploymentArn: ${latest.serviceDeploymentArn}`)
    switch (latest.status) {
      case 'SUCCESSFUL':
        core.info(`Latest deployment was ${latest.status} at ${date} ${time}`)
        break
      case 'ROLLBACK_SUCCESSFUL':
        core.setFailed(
          `Latest deployment was in a failed state: ${latest.status} at ${date} ${time}`
        )
        break
      default:
        core.setFailed(
          `Latest deployment was in an unexpected state: ${latest.status} at ${date} ${time}`
        )
        break
    }
  } else {
    core.setFailed('No service deployment details were returned')
  }
}
