import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { makeProject } from 'test/factories/make-project'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { AddTagToProjectUseCase } from './add-tag-project'
import { makeTag } from 'test/factories/make-tag'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryTagRepository: InMemoryTagRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: AddTagToProjectUseCase

describe('Add tag to pr', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    inMemoryTagRepository = new InMemoryTagRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new AddTagToProjectUseCase(inMemoryProjectRepository)
  })

  it('should be able add ta to project', async () => {
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

    const tag = makeTag({
      customerId: customer.id,
    })

    await inMemoryTagRepository.create(tag)

    const result = await sut.execute({
      projectId: project.id.toString(),
      tag,
    })

    const projectCreated = await inMemoryProjectRepository.findById(
      project.id.toString(),
    )

    projectCreated?.tags?.forEach((item) => {
      expect(item.name).toEqual(tag.name)
    })
    expect(result.isRight()).toBe(true)
  })
})
