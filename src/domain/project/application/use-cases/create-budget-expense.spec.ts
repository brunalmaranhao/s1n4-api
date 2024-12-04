import { InMemoryBudgetExpenseRepository } from 'test/repositories/in-memory-budget-expense'
import { CreateBudgetExpenseUseCase } from './create-budget-expense'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'

let inMemoryBudgetExpenseRepository: InMemoryBudgetExpenseRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: CreateBudgetExpenseUseCase

describe('Create new budget expense', () => {
  beforeEach(() => {
    inMemoryBudgetExpenseRepository = new InMemoryBudgetExpenseRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new CreateBudgetExpenseUseCase(
      inMemoryBudgetExpenseRepository,
      inMemoryProjectRepository,
    )
  })

  it('should be able to register a new budget expense', async () => {
    const project = makeProject({
      budget: 120,
    })
    const newPoject = await inMemoryProjectRepository.create(project)
    const result = await sut.execute({
      title: 'teste',
      amount: 100,
      projectId: newPoject.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('dont should  be able to register a new budget expense', async () => {
    const project = makeProject({
      budget: 90,
    })
    const newPoject = await inMemoryProjectRepository.create(project)
    const result = await sut.execute({
      title: 'teste',
      amount: 100,
      projectId: newPoject.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
