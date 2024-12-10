import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { UpdateProjectUseCase } from './update-project'
import { makeProject } from 'test/factories/make-project'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: UpdateProjectUseCase

describe('Update Project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()

    sut = new UpdateProjectUseCase(inMemoryProjectRepository)
  })

  it('should be able to edit a Project', async () => {
    const project = makeProject()

    await inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
      project: {
        name: 'Novo nome de projeto',
        deadline: new Date('2025-04-05'),
        customerId: project.customerId.toString(),
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.project.name).toEqual('Novo nome de projeto')
      expect(result.value.project.deadline).toEqual(new Date('2025-04-05'))
      expect(result.value.project.status).toEqual('ACTIVE')
      expect(result.value.project.customerId).toEqual(project.customerId)
    }
  })
})
