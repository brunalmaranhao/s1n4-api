import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { FetchNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-notification-by-recipient'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotificationPresenter } from '../../presenter/notification-presnter'

@ApiTags('notifications')
@Controller('/notifications')
export class FetchNotificationsController {
  constructor(private fetchNotificationsUseCase: FetchNotificationsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchNotificationsUseCase.execute({
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const notifications = result.value.notifications
    const presenter = notifications.map(NotificationPresenter.toHTTP)

    return { notifications: presenter }
  }
}
