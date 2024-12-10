import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { makeProject } from 'test/factories/make-project'
import { AddProjectListProjectUseCase } from './add-project-list-project'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: AddProjectListProjectUseCase

describe('Add project in list project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new AddProjectListProjectUseCase(
      inMemoryProjectRepository,
      inMemoryListProjectRepository,
    )
  })

  it('should be able add project in list project', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const listProject = makeListProject({
      name: 'Em andamaneto',
      customerId: customer.id,
    })

    const listProject2 = makeListProject({
      name: 'Finalizado',
      customerId: customer.id,
    })

    await inMemoryListProjectRepository.create(listProject)
    await inMemoryListProjectRepository.create(listProject2)

    const project = makeProject({
      listProjectsId: listProject.id,
      customerId: customer.id,
    })

    const oldProject = await inMemoryProjectRepository.create(project)

    console.log('list1 ' + listProject.id.toString())
    console.log('list2 ' + listProject2.id.toString())

    const result = await sut.execute({
      projectId: project.id.toString(),
      listProjectId: listProject2.id.toString(),
    })

    const projectCreated = await inMemoryProjectRepository.findById(
      oldProject.id.toString(),
    )

    console.log(result)

    expect(projectCreated?.listProjectsId.toString()).toEqual(
      listProject2.id.toString(),
    )
    expect(result.isRight()).toBe(true)
  })
})
