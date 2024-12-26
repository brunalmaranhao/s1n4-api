import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeProjectUpdates } from 'test/factories/make-project-updates'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { FetchProjectUpdateByProjectUseCase } from './fetch-project-updates-by-project'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryProjectUpdateRepository: InMemoryProjectUpdateRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchProjectUpdateByProjectUseCase

describe('update project', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryProjectUpdateRepository = new InMemoryProjectUpdateRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchProjectUpdateByProjectUseCase(
      inMemoryProjectUpdateRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to fetch updates by project', async () => {
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
      projectId: project.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.projectUpdates).toHaveLength(1)
    }
  })
})
