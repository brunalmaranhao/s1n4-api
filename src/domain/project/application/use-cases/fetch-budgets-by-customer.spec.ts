import { InMemoryBudgetExpenseRepository } from 'test/repositories/in-memory-budget-expense'
import { FetchBudgetsExpenseByCustomerUseCase } from './fetch-budgets-by-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-Customer'
import { makeBudgetExpense } from 'test/factories/make-budget-expense'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'

let inMemoryBudgetExpenseRepository: InMemoryBudgetExpenseRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchBudgetsExpenseByCustomerUseCase

describe('Fetch BudgetExpense', () => {
  beforeEach(() => {
    inMemoryBudgetExpenseRepository = new InMemoryBudgetExpenseRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchBudgetsExpenseByCustomerUseCase(
      inMemoryBudgetExpenseRepository,
      inMemoryCustomerRepository,
    )
  })

  it('should be able to fetch BudgetExpense by id', async () => {
    const customer = makeCustomer()
    const newCustomer = await inMemoryCustomerRepository.create(customer)

    const project = makeProject({
      budget: 120,
    })

    const newProject = await inMemoryProjectRepository.create(project)

    const expense = makeBudgetExpense({
      amount: 100,
      projectId: newProject.id,
    })

    await inMemoryBudgetExpenseRepository.create(expense)

    const result = await sut.execute({ customerId: newCustomer.id.toString() })

    expect(result.isRight()).toBe(true)
  })
})
