import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'
import { CustomerFactory } from 'test/factories/make-customer'

describe('Fetch Responsible Parties by Id  (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let responsibleFactory: ResponsiblePartiesFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ResponsiblePartiesFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    responsibleFactory = moduleRef.get(ResponsiblePartiesFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /responsible-parties/id/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer()

    const responsible = await responsibleFactory.makePrismaResponsibleParties({
      customerId: customer.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const response = await request(app.getHttpServer())
      .get(`/responsible-parties/id/${responsible.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.responsible.id.toString()).toEqual(
      responsible.id.toString(),
    )
  })
})
