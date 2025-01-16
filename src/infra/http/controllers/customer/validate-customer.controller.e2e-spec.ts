import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { UserFactory } from 'test/factories/make-user'

describe('Validate Customer (E2E)', () => {
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
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /validate-customer', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer({
      cnpj: '73.236.044/0001-99',
    })

    const response = await request(app.getHttpServer())
      .post('/validate-customer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: customer.name,
        corporateName: customer.corporateName,
        cnpj: customer.cnpj,
      })
    console.log(response)
    expect(response.statusCode).toBe(409)
  })
})
