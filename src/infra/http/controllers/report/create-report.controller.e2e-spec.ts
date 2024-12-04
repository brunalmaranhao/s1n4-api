import { CustomerFactory } from 'test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Create Report (E2E)', () => {
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

  test('[POST] /report', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const response = await request(app.getHttpServer())
      .post('/report')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Relatório de Teste',
        customerId: customer.id.toString(),
        pbiWorkspaceId: 'a650f21e-bb09-4d21-9d39-41dd3c376ecf',
        pbiReportId: '1d67a197-19dd-4f1e-b8d1-937114048fc0',
      })

    expect(response.statusCode).toBe(201)

    const reportOnDatabase = await prisma.report.findFirst({
      where: {
        name: 'Relatório de Teste',
      },
    })

    expect(reportOnDatabase).toBeTruthy()
  })
})
