import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { FetchCustomerProjectsUseCase } from './fetch-customer-projects'
import { makeProject } from 'test/factories/make-project'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { FetchCustomerProjectsByUserUseCase } from './fetch-customer-projects-by-user'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCustomerProjectsByUserUseCase

describe('Fetch customer projects', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchCustomerProjectsByUserUseCase(
      inMemoryUserRepository,
      inMemoryCustomerRepository,
      inMemoryProjectRepository,
    )
  })

  it('should be able to fetch customer projects', async () => {
    const customer = makeCustomer()
    const user = makeUser({
      customerId: customer.id,
    })

    const project1 = makeProject({ customerId: customer.id })
    const project2 = makeProject({ customerId: customer.id })
    const project3 = makeProject({ customerId: customer.id })
    const project4 = makeProject({ customerId: customer.id })

    await inMemoryUserRepository.create(user)
    await inMemoryCustomerRepository.create(customer)

    await Promise.all([
      inMemoryProjectRepository.create(project1),
      inMemoryProjectRepository.create(project2),
      inMemoryProjectRepository.create(project3),
      inMemoryProjectRepository.create(project4),
    ])

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    // console.log(result)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.projects).toHaveLength(4)
      result.value.projects.map((project) => {
        return expect(project.customerId?.toString()).toEqual(
          customer.id.toString(),
        )
      })
    }
  })
})
