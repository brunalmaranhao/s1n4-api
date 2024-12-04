import { CustomerFactory } from '../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ProjectFactory } from 'test/factories/make-project'
import { PeriodicReportFactory } from 'test/factories/make-periodic-report'

describe('Fetch Periodic Report (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let projectFactory: ProjectFactory
  let periodicReportFactory: PeriodicReportFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        ProjectFactory,
        PeriodicReportFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    projectFactory = moduleRef.get(ProjectFactory)
    periodicReportFactory = moduleRef.get(PeriodicReportFactory)

    await app.init()
  })

  test('[GET] /periodic-report', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const user = await userFactory.makePrismaUserManagement({
      customerId: customer.id,
      role: 'CLIENT_OWNER',
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'CLIENT_OWNER',
    })

    const project = await projectFactory.makePrismaProject({
      budget: 800,
      customerId: customer.id,
    })
    // console.log(project.id.toString())

    await Promise.all([
      periodicReportFactory.makePrismaPeriodicReport({
        projectId: project.id,
        month: '01',
        name: 'Report Test',
        url: 'test-1.pdf',
        year: '2024',
      }),
      periodicReportFactory.makePrismaPeriodicReport({
        projectId: project.id,
        month: '02',
        name: 'Report Test 2',
        url: 'test.pdf',
        year: '2024',
      }),
      periodicReportFactory.makePrismaPeriodicReport({
        projectId: project.id,
        month: '03',
        name: 'Report Test 3',
        url: 'test3.pdf',
        year: '2023',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/periodic-report`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.periodicReports).toHaveLength(3)
  })
})
