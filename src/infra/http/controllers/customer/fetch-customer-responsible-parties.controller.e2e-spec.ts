import { CustomerFactory } from '../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'

describe('Fetch Customer Responsible Parties (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let responsiblePartiesFactory: ResponsiblePartiesFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ResponsiblePartiesFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    responsiblePartiesFactory = moduleRef.get(ResponsiblePartiesFactory)

    await app.init()
  })

  test('[GET] /customer/:customerId/responsible-parties', async () => {
    const user = await userFactory.makePrismaUserManagement()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      responsiblePartiesFactory.makePrismaResponsibleParties({
        customerId: customer.id,
      }),
      responsiblePartiesFactory.makePrismaResponsibleParties({
        customerId: customer.id,
      }),
      responsiblePartiesFactory.makePrismaResponsibleParties({
        customerId: customer.id,
      }),
      responsiblePartiesFactory.makePrismaResponsibleParties({
        customerId: customer.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/customer/${customer.id}/responsible-parties`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.responsibleParties).toHaveLength(4)
    expect(response.body).toEqual({
      responsibleParties: expect.arrayContaining([
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
      ]),
    })
  })
})
