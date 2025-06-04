import * as core from '@actions/core'

import { CommandOptions, execute } from './utils/execute'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const options: CommandOptions = {
      ecsCluster: core.getInput('ecs-cluster'),
      ecsService: core.getInput('ecs-service')
    }

    if (!options.ecsCluster) {
      throw new Error('ECS cluster not specified')
    }
    if (!options.ecsService) {
      throw new Error('ECS service not specified')
    }

    core.debug(
      `Checking latest ECS deployment using ${JSON.stringify(
        options,
        null,
        2
      )}...`
    )

    await execute(options)

    core.debug(`All clear on the western front.`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
