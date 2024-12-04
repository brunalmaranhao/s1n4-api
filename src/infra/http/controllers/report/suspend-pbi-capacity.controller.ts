import { ConflictException, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PbiCapacityManagementService } from '@/infra/pbi/capacity-management'

@ApiTags('report')
@Controller('/suspend-pbi-capacity')
export class SuspendPbiCapacityController {
  constructor(
    private pbiCapacityManagementService: PbiCapacityManagementService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle() {
    try {
      // const status = ['Succeeded', 'Resuming', 'Pausing', 'Paused']
      const response =
        await this.pbiCapacityManagementService.getCapacityState()
      const responseObject = await response?.json()
      // console.log(responseObject.value[0].properties.state)
      // return { response: responseObject }
      if (responseObject.value[0].properties.state === 'Succeeded') {
        await this.pbiCapacityManagementService.suspend()
        return {
          suspend: true,
          message: 'Capacity suspend  has been succeeded',
        }
      } else if (responseObject.value[0].properties.state === 'Resuming') {
        const capacityResumed = await this.waitForCapacityToResume(
          this.pbiCapacityManagementService,
        )
        if (capacityResumed) {
          return {
            suspend: true,
            message: 'Capacity suspend  has been succeeded',
          }
        } else {
          return {
            suspend: false,
            message:
              'The status of the capacity state is different from succeeded',
          }
        }
      } else {
        return {
          suspend: false,
          message:
            'The status of the capacity state is different from succeeded',
        }
      }
    } catch (error) {
      console.log(error)
      throw new ConflictException(
        'Não foi possível suspender a capacidade do powerbi',
      )
    }
  }

  async waitForCapacityToResume(
    pbiCapacityManagementService: PbiCapacityManagementService,
    maxRetries = 10,
    delay = 6000,
  ): Promise<boolean> {
    let retries = 0

    while (retries < maxRetries) {
      const response = await pbiCapacityManagementService.getCapacityState()
      const responseObject = await response?.json()

      if (responseObject.value[0].properties.state === 'Succeeded') {
        return true
      }

      retries++

      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    return false
  }
}
