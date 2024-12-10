import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { RemoveListProjectUseCase } from './remove-list-project'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryListProjectsRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: RemoveListProjectUseCase

describe('Remove List Project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryListProjectsRepository = new InMemoryListProjectsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new RemoveListProjectUseCase(
      inMemoryListProjectsRepository,
      inMemoryProjectRepository,
    )
  })

  it('should be able to remove a new Project', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)
    const listProject = makeListProject({
      customerId: customer.id,
    })
    const listProject2 = makeListProject({
      customerId: customer.id,
    })

    await inMemoryListProjectsRepository.create(listProject)
    await inMemoryListProjectsRepository.create(listProject2)

    const project1 = makeProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
    })
    const project2 = makeProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
    })
    const project3 = makeProject({
      customerId: customer.id,
      listProjectsId: listProject2.id,
    })

    await inMemoryProjectRepository.create(project1)
    await inMemoryProjectRepository.create(project2)
    await inMemoryProjectRepository.create(project3)

    const result = await sut.execute({
      id: listProject.id.toString(),
    })

    const updatedListProject = await inMemoryListProjectsRepository.findById(
      listProject.id.toString(),
    )

    expect(updatedListProject?.status).toEqual('INACTIVE')

    expect(result.isRight()).toBe(true)
  })
})
