import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadFileUseCase } from '@/domain/project/application/use-cases/upload-file'
import { InvalidFileTypeError } from '@/domain/project/application/use-cases/errors/invalid-file'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { CreatePeriodicReportUseCase } from '@/domain/project/application/use-cases/create-periodic-report'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('periodic-report')
@Controller('/periodic-report')
export class PeriodicReportController {
  constructor(
    private uploadFile: UploadFileUseCase,
    private createPeriodicReportUseCase: CreatePeriodicReportUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        year: {
          type: 'string',
        },
        month: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        projectId: {
          type: 'string',
        },
      },
    },
  })
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @UploadedFile()
    file: Express.Multer.File,
    @Body('year') year: string,
    @Body('month') month: string,
    @Body('name') name: string,
    @Body('projectId') projectId: string,
  ) {
    // console.log(file)
    // console.log(name)
    // console.log(month)
    // console.log(year)
    // console.log(customerId)
    if (!file || !year || !month || !name || !projectId) {
      throw new BadRequestException('Required fields.')
    }

    if (file) {
      const fileValidationPipe = new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10mb
          new FileTypeValidator({
            fileType: '.(pdf)',
          }),
        ],
      })

      await fileValidationPipe.transform(file)
    }

    const resultUpload = await this.uploadFile.execute({
      projectId,
      label: `${month}-${year}-${name.toLowerCase().replace(/\s+/g, '')}`,
      type: file.mimetype,
      body: file.buffer,
    })

    if (resultUpload.isLeft()) {
      const error = resultUpload.value
      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { url } = resultUpload.value

    const resultCreate = await this.createPeriodicReportUseCase.execute({
      name,
      url,
      projectId,
      month,
      year,
    })

    if (resultCreate.isLeft()) {
      const error = resultCreate.value
      switch (error.constructor) {
        case InternalServerErrorException:
          throw new InternalServerErrorException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      report: resultCreate.value.report.id,
    }
  }
}
