import { Body, Controller, HttpCode, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { UpdateOrderListProjectUseCase } from '@/domain/project/application/use-cases/update-order-list-project'
import { UpdateOrderDto } from './dto/update-order-dto'

const updateOrderListProjectBodySchema = z.object({
  order: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().positive(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateOrderListProjectBodySchema,
)

@ApiTags('list-project')
@Controller('/list-project/update-order')
export class UpdateOrderListProjectController {
  constructor(
    private updateOrderListProjectUseCase: UpdateOrderListProjectUseCase,
  ) {}

  @Patch()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: UpdateOrderDto) {
    await this.updateOrderListProjectUseCase.execute({
      orderData: body.order,
    })
  }
}
