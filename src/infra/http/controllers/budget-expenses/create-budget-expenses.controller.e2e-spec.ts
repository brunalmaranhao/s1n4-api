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

describe('Create BudgetExpense (E2E)', () => {
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

  test('[POST] /budget-expense', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/budget-expense')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Despesa 1',
        amount: 100,
        projectId: project.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const budgetExpenseOnDatabase = await prisma.budgetExpense.findFirst({
      where: {
        title: 'Despesa 1',
      },
    })

    expect(budgetExpenseOnDatabase).toBeTruthy()
  })
})
