import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ReportFactory } from 'test/factories/make-report'
import { UserFactory } from 'test/factories/make-user'

describe('Remove Report (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let reportFactory: ReportFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ReportFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    reportFactory = moduleRef.get(ReportFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[DELETE] /report/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })
    const customer = await customerFactory.makePrismaCustomer()
    const report = await reportFactory.makePrismaReport({
      customerId: customer.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/report/${report.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const inactiveReportOnDatabase = await prisma.report.findFirst({
      where: {
        status: 'INACTIVE',
      },
    })

    expect(inactiveReportOnDatabase).toBeTruthy()
    expect(inactiveReportOnDatabase?.status).toBe('INACTIVE')
  })
})
