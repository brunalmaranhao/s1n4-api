import { InMemoryBudgetExpenseRepository } from 'test/repositories/in-memory-budget-expense'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { makeBudgetExpense } from 'test/factories/make-budget-expense'
import { FetchBudgetsExpenseBalanceUseCase } from './fetch-budget-expense-balance'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryBudgetExpenseRepository: InMemoryBudgetExpenseRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchBudgetsExpenseBalanceUseCase

describe('Fetch BudgetExpense', () => {
  beforeEach(() => {
    inMemoryBudgetExpenseRepository = new InMemoryBudgetExpenseRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchBudgetsExpenseBalanceUseCase(
      inMemoryBudgetExpenseRepository,
      inMemoryProjectRepository,
    )
  })

  it('should be able to fetch BudgetExpense balance by project', async () => {
    const project = makeProject({
      budget: 120,
    })
    const newPoject = await inMemoryProjectRepository.create(project)

    const expense = makeBudgetExpense({
      amount: 100,
      projectId: newPoject.id,
    })
    const expense2 = makeBudgetExpense({
      amount: 2,
      projectId: newPoject.id,
    })

    const expense3 = makeBudgetExpense({
      amount: 5,
      projectId: newPoject.id,
    })

    await inMemoryBudgetExpenseRepository.create(expense)
    await inMemoryBudgetExpenseRepository.create(expense2)
    await inMemoryBudgetExpenseRepository.create(expense3)

    const result = await sut.execute({ projectId: project.id.toString() })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      amountBudgetExpense: 107,
      balance: 13,
      budget: 120,
      totalBudgetExpense: 3,
    })
  })

  it('should be able to fetch BudgetExpense balance by customer', async () => {
    const customer = makeCustomer()

    const customer2 = makeCustomer()

    await inMemoryCustomerRepository.create(customer)
    // await inMemoryCustomerRepository.create(customer2)

    const project = makeProject({
      budget: 150,
      customerId: customer.id,
      customer,
    })

    const project2 = makeProject({
      budget: 20,
      customerId: customer.id,
      customer,
    })
    const project3 = makeProject({
      budget: 90,
      customerId: customer2.id,
      customer: customer2,
    })

    const newPoject1 = await inMemoryProjectRepository.create(project)
    const newPoject2 = await inMemoryProjectRepository.create(project2)
    const newPoject3 = await inMemoryProjectRepository.create(project3)

    const expense = makeBudgetExpense({
      amount: 100,
      projectId: newPoject1.id,
      project: newPoject1,
    })
    const expense2 = makeBudgetExpense({
      amount: 2,
      projectId: newPoject2.id,
      project: newPoject2,
    })

    const expense3 = makeBudgetExpense({
      amount: 5,
      projectId: newPoject2.id,
      project: newPoject2,
    })

    const expense4 = makeBudgetExpense({
      amount: 21,
      projectId: newPoject3.id,
      project: newPoject3,
    })

    await inMemoryBudgetExpenseRepository.create(expense)
    await inMemoryBudgetExpenseRepository.create(expense2)
    await inMemoryBudgetExpenseRepository.create(expense3)
    await inMemoryBudgetExpenseRepository.create(expense4)

    const result = await sut.execute({ customerId: customer.id.toString() })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      amountBudgetExpense: 107,
      balance: 63,
      budget: 170,
      totalBudgetExpense: 3,
    })
  })

  it('should be able to fetch BudgetExpense balance', async () => {
    const customer = makeCustomer()

    const customer2 = makeCustomer()

    await inMemoryCustomerRepository.create(customer)
    await inMemoryCustomerRepository.create(customer2)

    const project = makeProject({
      budget: 150,
      customerId: customer.id,
    })

    const project2 = makeProject({
      budget: 20,
      customerId: customer.id,
    })

    const project3 = makeProject({
      budget: 90,
      customerId: customer2.id,
    })

    const newPoject1 = await inMemoryProjectRepository.create(project)
    const newPoject2 = await inMemoryProjectRepository.create(project2)
    const newPoject3 = await inMemoryProjectRepository.create(project3)

    const expense = makeBudgetExpense({
      amount: 100,
      projectId: newPoject1.id,
    })
    const expense2 = makeBudgetExpense({
      amount: 2,
      projectId: newPoject2.id,
    })

    const expense3 = makeBudgetExpense({
      amount: 5,
      projectId: newPoject2.id,
    })

    const expense4 = makeBudgetExpense({
      amount: 21,
      projectId: newPoject3.id,
    })

    await inMemoryBudgetExpenseRepository.create(expense)
    await inMemoryBudgetExpenseRepository.create(expense2)
    await inMemoryBudgetExpenseRepository.create(expense3)
    await inMemoryBudgetExpenseRepository.create(expense4)

    const result = await sut.execute({})
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      amountBudgetExpense: 128,
      balance: 132,
      budget: 260,
      totalBudgetExpense: 4,
    })
  })
})
