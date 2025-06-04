/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as core from '@actions/core'
import * as main from '../src/main'

describe('action', () => {
  const debugMock = vi.spyOn(core, 'debug').mockImplementation(() => {})
  const errorMock = vi.spyOn(core, 'error').mockImplementation(() => {})
  const getInputMock = vi.spyOn(core, 'getInput').mockImplementation(() => '')
  const setFailedMock = vi.spyOn(core, 'setFailed').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debugs out an input', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'ecs-cluster':
          return 'test-cluster'
        case 'ecs-service':
          return 'test-service'
        default:
          return ''
      }
    })

    await main.run()

    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('Checking latest ECS deployment using')
    )
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(() => '')

    await main.run()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'ECS cluster not specified'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
