import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { CustomerFactory } from 'test/factories/make-customer'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Fetch responsibles birthdays of the day  (E2E)', () => {
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

  test('[GET] /responsible-parties/birthdays-of-the-month', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer()

    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()

    await Promise.all([
      responsibleFactory.makePrismaResponsibleParties({
        customerId: customer.id,
        birthdate: new Date('08-18-1994'),
      }),
      responsibleFactory.makePrismaResponsibleParties({
        customerId: customer.id,
        birthdate: new Date('05-10-1994'),
      }),
      responsibleFactory.makePrismaResponsibleParties({
        customerId: customer.id,
        birthdate: new Date(`${month}-${day}-1990`),
      }),
      responsibleFactory.makePrismaResponsibleParties({
        customerId: customer.id,
        birthdate: new Date(`${month}-${day}-1990`),
      }),
    ])

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const response = await request(app.getHttpServer())
      .get(`/responsible-parties/birthdays-of-the-month`)
      .set('Authorization', `Bearer ${accessToken}`)

    // console.log(response.body);

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      responsiblesBirthdayOfTheMonth: expect.arrayContaining([
        expect.objectContaining({
          birthdate: new Date(`${month}-${day}-1990`).toISOString(),
        }),
        expect.objectContaining({
          birthdate: new Date(`${month}-${day}-1990`).toISOString(),
        }),
      ]),
    })
  })
})
