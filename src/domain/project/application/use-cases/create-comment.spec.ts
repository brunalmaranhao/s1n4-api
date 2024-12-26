import { CreateCommentUseCase } from './create-Comment'
import { InMemoryCommentRepository } from 'test/repositories/in-memory-Comment-repository'
import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeProjectUpdates } from 'test/factories/make-project-updates'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { Project } from '../../enterprise/entities/project'

let inMemoryCommentRepository: InMemoryCommentRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryProjectUpdateRepository: InMemoryProjectUpdateRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: CreateCommentUseCase

describe('Create new Comment', () => {
  beforeEach(() => {
    inMemoryCommentRepository = new InMemoryCommentRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryProjectUpdateRepository = new InMemoryProjectUpdateRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new CreateCommentUseCase(
      inMemoryCommentRepository,
      inMemoryProjectUpdateRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to register a new Comment', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const user = makeUser({
      customerId: customer.id,
    })
    await inMemoryUserRepository.create(user)

    const project = makeProject({
      customerId: customer.id,
    })

    await inMemoryProjectRepository.create(project)

    const projectUpdate = makeProjectUpdates({
      projectId: project.id,
    })
    await inMemoryProjectUpdateRepository.create(projectUpdate)

    const result = await sut.execute({
      authorId: user.id.toString(),
      projectUpdateId: projectUpdate.id.toString(),
      content: 'Lorem ipsum',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to register a new Comment', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const customer2 = makeCustomer()
    await inMemoryCustomerRepository.create(customer2)

    const user = makeUser({
      customerId: customer2.id,
      role: 'CLIENT_OWNER',
    })
    await inMemoryUserRepository.create(user)

    const project = makeProject({
      customerId: customer.id,
    })

    await inMemoryProjectRepository.create(project)

    const projectUpdate = makeProjectUpdates({
      projectId: project.id,
      project: project as Project,
    })
    await inMemoryProjectUpdateRepository.create(projectUpdate)

    const result = await sut.execute({
      authorId: user.id.toString(),
      projectUpdateId: projectUpdate.id.toString(),
      content: 'Lorem ipsum',
    })

    expect(result.isLeft()).toBe(true)
  })
})
