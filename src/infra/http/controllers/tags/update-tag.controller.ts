import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateTagUseCase } from '@/domain/project/application/use-cases/update-tag'
import { UpdateTagDto } from './dto/update-tag-dto'
import { EditTagProps } from '@/domain/project/application/repositories/tag-repository'
import { TagNotFoundError } from '@/domain/project/application/use-cases/errors/tag-not-found-error'

const updateTagBodySchema = z
  .object({
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (data) => {
      const keys = Object.keys(data)
      return keys.some((key) => data[key] !== undefined)
    },
    {
      message: 'Pelo menos um dos atributos deve estar presente.',
    },
  )

const bodyValidationPipe = new ZodValidationPipe(updateTagBodySchema)

@ApiTags('tag')
@Controller('/tag/update/:id')
export class UpdateTagController {
  constructor(private updateTagUseCase: UpdateTagUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateTagDto,
    @Param('id') id: string,
  ) {
    const { name, color } = body

    const tag: EditTagProps = {
      name,
      color,
    }

    const result = await this.updateTagUseCase.execute({
      id,
      tag,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case TagNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
