import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { CreateReportDto } from './dto/create-report-dto'
import { ReportAlreadyExistsError } from '@/domain/project/application/use-cases/errors/report-already-exists-error'
import { CreateReportUseCase } from '@/domain/project/application/use-cases/create-Report'

const createReportBodySchema = z.object({
  name: z.string(),
  pbiWorkspaceId: z.string(),
  pbiReportId: z.string(),
  customerId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createReportBodySchema)

@ApiTags('report')
@Controller('/report')
export class CreateReportController {
  constructor(private createReportUseCase: CreateReportUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateReportDto) {
    const { name, customerId, pbiReportId, pbiWorkspaceId } = body

    const result = await this.createReportUseCase.execute({
      name,
      customerId,
      pbiReportId,
      pbiWorkspaceId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ReportAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { report } = result.value

    return { reportId: report.id.toString() }
  }
}
