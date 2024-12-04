import {
  BadRequestException,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveReportUseCase } from '@/domain/project/application/use-cases/remove-report'
import { ReportNotFoundError } from '@/domain/project/application/use-cases/errors/report-not-found-error'
import { ReportAlreadyInativeError } from '@/domain/project/application/use-cases/errors/report-already-inative-error'

@ApiTags('report')
@Controller('/report/:id')
export class RemoveReportController {
  constructor(private removeReportUseCase: RemoveReportUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeReportUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ReportNotFoundError:
          throw new ConflictException(error.message)
        case ReportAlreadyInativeError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
