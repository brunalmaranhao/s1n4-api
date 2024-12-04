import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'
import { UserFactory } from 'test/factories/make-user'
import * as path from 'path'

describe('Create Periodic Report (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let projectFactory: ProjectFactory
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /periodic-report', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const project = await projectFactory.makePrismaProject({
      budget: 120,
      customerId: customer.id,
    })

    const testFilePath = path.resolve(__dirname, './test-files/sample.pdf')

    const response = await request(app.getHttpServer())
      .post('/periodic-report')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'Report Test')
      .field('year', '2024')
      .field('month', '01')
      .field('projectId', project.id.toString())
      .attach('file', testFilePath)

    expect(response.statusCode).toBe(201)

    const periodicReportOnDatabase = await prisma.periodicReports.findFirst({
      where: {
        name: 'Report Test',
        projectId: project.id.toString(),
      },
    })

    expect(periodicReportOnDatabase).toBeTruthy()
  })
})
