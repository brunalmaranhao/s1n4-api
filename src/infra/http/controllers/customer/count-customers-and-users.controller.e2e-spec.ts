import { CustomerFactory } from '../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ProjectFactory } from 'test/factories/make-project'

describe('Fetch Customer Projects (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ProjectFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /customer/count', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const user = await userFactory.makePrismaUserManagement()
    await userFactory.makePrismaUser({
      customerId: customer.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const response = await request(app.getHttpServer())
      .get(`/customer/count`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    // console.log(response)
    expect(response.statusCode).toBe(200)
    console.log(response.body)
    // expect(response.body.projects).toHaveLength(4)
  })
})
