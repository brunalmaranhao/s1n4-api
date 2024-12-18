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
import { CreateTagUseCase } from '@/domain/project/application/use-cases/create-tag'
import { CreateTagDto } from './dto/create-tag-dto'
import { TagAlreadyExistsError } from '@/domain/project/application/use-cases/errors/tag-already-exists'

const createTagsBodySchema = z.object({
  name: z.string(),
  color: z.string(),
  customerId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createTagsBodySchema)

@ApiTags('tag')
@Controller('/tag')
export class CreateTagController {
  constructor(private createTagsUseCase: CreateTagUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateTagDto) {
    const { name, customerId, color } = body

    const result = await this.createTagsUseCase.execute({
      name,
      customerId,
      color,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TagAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { tag } = result.value

    return { tagId: tag.id.toString() }
  }
}
