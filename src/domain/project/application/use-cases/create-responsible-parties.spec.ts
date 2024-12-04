import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'
import { CreateResponsiblePartiesUseCase } from './create-responsible-parties'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: CreateResponsiblePartiesUseCase

describe('Create new responsible parties', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new CreateResponsiblePartiesUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to register a new responsbile parties', async () => {
    const customer = makeCustomer()

    const newCustomer = await inMemoryCustomerRepository.create(customer)

    const responsible = makeResponsibleParties()
    const result = await sut.execute({
      firstName: responsible.firstName,
      email: responsible.email,
      lastName: responsible.lastName,
      customerId: newCustomer.id.toString(),
      birthdate: responsible.birthdate,
      phone: responsible.phone,
    })

    expect(result.isRight()).toBe(true)
  })
})
