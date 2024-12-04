import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'
import { UserFactory } from 'test/factories/make-user'

describe('Update Customer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let responsiblePartiesFactory: ResponsiblePartiesFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ResponsiblePartiesFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    responsiblePartiesFactory = moduleRef.get(ResponsiblePartiesFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[PUT] /responsible-parties/update/id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })
    const customer = await customerFactory.makePrismaCustomer()
    const responsible =
      await responsiblePartiesFactory.makePrismaResponsibleParties({
        customerId: customer.id,
      })

    const response = await request(app.getHttpServer())
      .put(`/responsible-parties/update/${responsible.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'novoemail@teste.com',
      })

    expect(response.statusCode).toBe(201)

    const responsibleParties = await prisma.responsibleParties.findFirst({
      where: {
        email: 'novoemail@teste.com',
      },
    })

    expect(responsibleParties).toBeTruthy()
  })
})
