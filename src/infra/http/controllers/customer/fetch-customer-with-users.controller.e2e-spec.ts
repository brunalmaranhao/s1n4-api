import { CustomerFactory } from 'test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Customers with Users (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /customer-with-users', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      userFactory.makePrismaUser({ customerId: customer.id }),
      userFactory.makePrismaUser({ customerId: customer.id }),
      userFactory.makePrismaUser({ customerId: customer.id }),
    ])

    const response = await request(app.getHttpServer())
      .get('/customer-with-users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '1', size: '10' })

    // console.log(response.body.customersWithUsers[0].users);

    expect(response.statusCode).toBe(200)
    expect(response.body.customersWithUsers).toHaveLength(1)
    expect(response.body.customersWithUsers[0].users).toHaveLength(3)
  })
})
