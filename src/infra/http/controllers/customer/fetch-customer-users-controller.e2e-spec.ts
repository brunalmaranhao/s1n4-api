import { CustomerFactory } from './../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Fetch Customer Users (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /customer/:customerId/users', async () => {
    const user = await userFactory.makePrismaUserManagement()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      userFactory.makePrismaUser({ customerId: customer.id }),
      userFactory.makePrismaUser({ customerId: customer.id }),
      userFactory.makePrismaUser({ customerId: customer.id }),
      userFactory.makePrismaUser({ customerId: customer.id }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/customer/${customer.id}/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(4)
    expect(response.body).toEqual({
      users: expect.arrayContaining([
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
