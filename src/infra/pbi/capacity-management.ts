import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { PbiAuthService } from './auth'

@Injectable()
export class PbiCapacityManagementService {
  constructor(
    private config: EnvService,
    private pbiAuthService: PbiAuthService,
  ) {}

  async getCapacityState() {
    try {
      const url = `https://management.azure.com/subscriptions/${this.config.get('PBI_SUBSCRIPTION_ID')}/providers/Microsoft.PowerBIDedicated/capacities?api-version=2021-01-01`
      const headers = await this.pbiAuthService.getRequestHeader('management')
      if (headers.isLeft()) {
        const error = headers.value

        switch (error.constructor) {
          case UnauthorizedException:
            throw new UnauthorizedException(error.message)
          default:
            throw new BadRequestException(error.message)
        }
      }
      const { header } = headers.value

      const result = await fetch(url, {
        method: 'GET',
        headers: header,
      })
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async resume() {
    try {
      const url = `https://management.azure.com/subscriptions/${this.config.get('PBI_SUBSCRIPTION_ID')}/resourceGroups/grupo-recurso/providers/Microsoft.PowerBIDedicated/capacities/resource/resume?api-version=2021-01-01`
      const headers = await this.pbiAuthService.getRequestHeader('management')
      if (headers.isLeft()) {
        const error = headers.value

        switch (error.constructor) {
          case UnauthorizedException:
            throw new UnauthorizedException(error.message)
          default:
            throw new BadRequestException(error.message)
        }
      }
      const { header } = headers.value

      const result = await fetch(url, {
        method: 'POST',
        headers: header,
      })
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async suspend() {
    try {
      const url = `https://management.azure.com/subscriptions/${this.config.get('PBI_SUBSCRIPTION_ID')}/resourceGroups/grupo-recurso/providers/Microsoft.PowerBIDedicated/capacities/resource/suspend?api-version=2021-01-01`
      const headers = await this.pbiAuthService.getRequestHeader('management')
      if (headers.isLeft()) {
        const error = headers.value

        switch (error.constructor) {
          case UnauthorizedException:
            throw new UnauthorizedException(error.message)
          default:
            throw new BadRequestException(error.message)
        }
      }
      const { header } = headers.value

      const result = await fetch(url, {
        method: 'POST',
        headers: header,
      })
      return result
    } catch (err) {
      console.log(err)
    }
  }
}
