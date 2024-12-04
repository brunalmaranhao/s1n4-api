import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { UserFactory } from 'test/factories/make-user'

describe('Create Customer Address (E2E)', () => {
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
    customerFactory = moduleRef.get(CustomerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /customer-address', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const response = await request(app.getHttpServer())
      .post('/customer-address')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Recife',
        country: 'Brasil',
        customerId: customer.id.toString(),
        neighborhood: 'Boa viagem',
        number: '102',
        state: 'Pernambuco',
        street: 'Ribeiro de brito',
        zipCode: '50720-020',
        complement: 'apt 102',
      })

    expect(response.statusCode).toBe(201)

    const customerOnDatabase = await prisma.customerAddress.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
    })

    expect(customerOnDatabase).toBeTruthy()
  })
})
