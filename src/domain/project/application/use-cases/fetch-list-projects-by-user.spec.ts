import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { FetchListProjectsByCustomerUseCase } from './fetch-list-projects-by-customer'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { FetchListProjectsByUserUseCase } from './fetch-list-projects-by-user'
import { makeUser } from 'test/factories/make-user'

let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchListProjectsByUserUseCase

describe('Fetch user list - projects', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    sut = new FetchListProjectsByUserUseCase(
      inMemoryListProjectRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to fetch customer projects', async () => {
    const customer = makeCustomer()

    const project1 = makeListProject({ customerId: customer.id })
    const project2 = makeListProject({ customerId: customer.id })
    const project3 = makeListProject({ customerId: customer.id })
    const project4 = makeListProject({ customerId: customer.id })

    await inMemoryCustomerRepository.create(customer)

    await Promise.all([
      inMemoryListProjectRepository.create(project1),
      inMemoryListProjectRepository.create(project2),
      inMemoryListProjectRepository.create(project3),
      inMemoryListProjectRepository.create(project4),
    ])

    const user = makeUser({
      customerId: customer.id,
    })

    await inMemoryUserRepository.create(user)
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.listProjects).toHaveLength(4)
      result.value.listProjects.map((project) => {
        return expect(project.customerId?.toString()).toEqual(
          customer.id.toString(),
        )
      })
    }
  })
})
