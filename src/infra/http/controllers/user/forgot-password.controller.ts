import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CreateInternalUserDto } from './dto/create-internal-user-dto'
import { SendMailProducer } from '@/infra/jobs/mail/send-mail-producer'
import { GenerateVerificationTokenUseCase } from '@/domain/project/application/use-cases/generate-verification-token'
import { subMinutes } from 'date-fns'
import { EmailNotFoundError } from '@/domain/project/application/use-cases/errors/email-not-found-error'
import { FileResendNotAllowedInTimeError } from '@/domain/project/application/use-cases/errors/file-resend-not-allowed-error'
import { Public } from '@/infra/auth/public'

const createUserBodySchema = z.object({
  email: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

@ApiTags('user')
@Controller('/user/forgot-password')
export class ForgotPasswordController {
  constructor(
    private sendMail: SendMailProducer,
    private generateVerificationTokenUseCase: GenerateVerificationTokenUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(@Body(bodyValidationPipe) body: CreateInternalUserDto) {
    const { email } = body

    const result = await this.generateVerificationTokenUseCase.execute({
      email,
      date: subMinutes(new Date(), 1),
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case EmailNotFoundError:
          throw new BadRequestException(error.message)
        case FileResendNotAllowedInTimeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { token } = result.value

    await this.sendMail.sendMailRecovery(email, token)
  }
}
