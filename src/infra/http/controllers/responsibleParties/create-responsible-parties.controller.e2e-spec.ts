import { CustomerFactory } from 'test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'

describe('Create Responsible Parties (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ResponsiblePartiesFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /responsible-parties', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const response = await request(app.getHttpServer())
      .post('/responsible-parties')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'João',
        lastName: 'José',
        email: 'joao@teste.com',
        phone: '8199732722',
        customerId: customer.id.toString(),
        birthdate: '1988-06-03T00:00:00.000Z',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.responsibleParties.findFirst({
      where: {
        email: 'joao@teste.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
