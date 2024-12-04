import { CustomerFactory } from '../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ProjectFactory } from 'test/factories/make-project'
import { BudgetExpenseFactory } from 'test/factories/make-budget-expense'

describe('Fetch Budget Expenses (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let projectFactory: ProjectFactory
  let budgetExpenseFactory: BudgetExpenseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        ProjectFactory,
        BudgetExpenseFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    budgetExpenseFactory = moduleRef.get(BudgetExpenseFactory)
    jwt = moduleRef.get(JwtService)
    projectFactory = moduleRef.get(ProjectFactory)

    await app.init()
  })

  test('[GET] /budget-expense/customer/:customerId', async () => {
    const user = await userFactory.makePrismaUserManagement()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const customer2 = await customerFactory.makePrismaCustomer({
      cnpj: '33.813.838/0001-56',
    })

    const project = await projectFactory.makePrismaProject({
      budget: 800,
      customerId: customer.id,
    })
    // console.log(project.id.toString())

    const project2 = await projectFactory.makePrismaProject({
      budget: 800,
      customerId: customer2.id,
    })

    const project3 = await projectFactory.makePrismaProject({
      budget: 800,
      customerId: customer.id,
    })

    await Promise.all([
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project.id,
      }),
    ])

    await Promise.all([
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project2.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project2.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project2.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project2.id,
      }),
    ])

    await Promise.all([
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project3.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project3.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project3.id,
      }),
      budgetExpenseFactory.makePrismaBudgetExpense({
        projectId: project3.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/budget-expense/customer/${customer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.data).toHaveLength(8)
  })
})
