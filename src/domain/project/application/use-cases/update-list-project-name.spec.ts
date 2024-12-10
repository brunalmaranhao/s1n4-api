import { makeProject } from 'test/factories/make-project'
import { UpdateListProjectUseCase } from './update-list-project-name'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'

let inMemoryListProjectRepository: InMemoryListProjectsRepository
let sut: UpdateListProjectUseCase

describe('Update List Project', () => {
  beforeEach(() => {
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()

    sut = new UpdateListProjectUseCase(inMemoryListProjectRepository)
  })

  it('should be able to edit a List Project', async () => {
    const listProject = makeListProject()

    await inMemoryListProjectRepository.create(listProject)

    const result = await sut.execute({
      id: listProject.id.toString(),
      name: 'Novo nome',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.listProject.name).toEqual('Novo nome')
      expect(result.value.listProject.customerId).toEqual(
        listProject.customerId,
      )
    }
  })
})
