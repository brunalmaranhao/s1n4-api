import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { UserFactory } from 'test/factories/make-user'

describe('Remove Customer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    await app.init()
  })

  test('[DELETE] /customer', async () => {
    const user = await userFactory.makePrismaUserManagement()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customerCreated = await customerFactory.makePrismaCustomer()

    const response = await request(app.getHttpServer())
      .delete(`/customer/${customerCreated.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: customerCreated.id.toString(),
      })
    // console.log(response)
    expect(response.statusCode).toBe(204)

    const customerOnDatabase = await prisma.customer.findFirst({
      where: {
        id: customerCreated.id.toString(),
        status: 'INACTIVE',
      },
    })

    expect(customerOnDatabase).toBeTruthy()
  })
})
