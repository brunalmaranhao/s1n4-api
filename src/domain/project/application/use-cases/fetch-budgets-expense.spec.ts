import { InMemoryBudgetExpenseRepository } from 'test/repositories/in-memory-budget-expense'
import { FetchBudgetsExpenseByProjectUseCase } from './fetch-budgets-by-project'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { makeBudgetExpense } from 'test/factories/make-budget-expense'
import { FetchBudgetsExpenseUseCase } from './fetch-budgets-expense'

let inMemoryBudgetExpenseRepository: InMemoryBudgetExpenseRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchBudgetsExpenseUseCase

describe('Fetch BudgetExpense', () => {
  beforeEach(() => {
    inMemoryBudgetExpenseRepository = new InMemoryBudgetExpenseRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchBudgetsExpenseUseCase(inMemoryBudgetExpenseRepository)
  })

  it('should be able to fetch BudgetExpense by id', async () => {
    const project = makeProject({
      budget: 120,
    })
    const newPoject = await inMemoryProjectRepository.create(project)

    const expense = makeBudgetExpense({
      amount: 100,
      projectId: newPoject.id,
    })

    await inMemoryBudgetExpenseRepository.create(expense)

    const result = await sut.execute({ page: 1, size: 5 })
    if (result.isRight()) {
      expect(result.value?.budgetExpenses).toHaveLength(1)
    }

    expect(result.isRight()).toBe(true)
  })
})
