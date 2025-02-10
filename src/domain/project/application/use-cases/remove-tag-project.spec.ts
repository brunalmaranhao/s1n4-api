import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { makeProject } from 'test/factories/make-project'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { RemoveTagFromProjectUseCase } from './remove-tag-project' // Alterado para o caso de uso de remoção
import { makeTag } from 'test/factories/make-tag'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryTagRepository: InMemoryTagRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: RemoveTagFromProjectUseCase

describe('Remove tag from project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    inMemoryTagRepository = new InMemoryTagRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new RemoveTagFromProjectUseCase(
      inMemoryProjectRepository,
      inMemoryTagRepository,
    )
  })

  it('should be able to remove tag from project', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const listProject = makeListProject({
      name: 'Em andamento',
      customerId: customer.id,
    })

    await inMemoryListProjectRepository.create(listProject)

    const project = makeProject({
      listProjectsId: listProject.id,
      customerId: customer.id,
    })

    await inMemoryProjectRepository.create(project)

    const tag = makeTag({
      customerId: customer.id,
    })
    await inMemoryTagRepository.create(tag)

    project.tags = [tag]

    const removeResult = await sut.execute({
      projectId: project.id.toString(),
      tagId: tag.id.toString(),
    })
    console.log(removeResult)

    const updatedProject = await inMemoryProjectRepository.findById(
      project.id.toString(),
    )
    expect(updatedProject?.tags).toBeDefined()
    expect(removeResult.isRight()).toBe(true)
    expect(updatedProject?.tags?.some((t) => t.id === tag.id)).toBe(false)
  })
})
