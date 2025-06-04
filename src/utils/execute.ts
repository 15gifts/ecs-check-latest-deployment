import * as core from '@actions/core'
import { ECS } from '@aws-sdk/client-ecs'

export interface CommandOptions {
  ecsCluster: string
  ecsService: string
}

export async function execute(options: CommandOptions): Promise<void> {
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
    core.debug(`serviceDeploymentArn: ${latest.serviceDeploymentArn}`)
    core.debug(`finishedAt: ${latest.finishedAt?.toLocaleString()}`)
    core.debug(`status: ${latest.status}`)
    switch (latest.status) {
      case 'SUCCESSFUL':
        core.info(
          `Latest deployment was ${latest.status}! ${latest.finishedAt?.toLocaleString()}`
        )
        return
      case 'ROLLBACK_SUCCESSFUL':
        core.error(
          `Latest deployment was ${latest.status}! ${latest.finishedAt?.toLocaleString()}`
        )
        return
    }
  }

  // core.debug(JSON.stringify(deployments, null, 2))
}
