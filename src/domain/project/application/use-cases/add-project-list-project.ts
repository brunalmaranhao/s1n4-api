import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectNotFoundError } from './errors/list-project-not-found-error'

interface AddProjectListProjectUseCaseRequest {
  projectId: string
  listProjectId: string
}

type AddProjectListProjecyUseCaseResponse = Either<
  ProjectNotFoundError | ListProjectNotFoundError,
  {
    listProjectId: string
  }
>

@Injectable()
export class AddProjectListProjectUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private listProjectRepository: ListProjectRepository,
  ) {}

  async execute({
    projectId,
    listProjectId,
  }: AddProjectListProjectUseCaseRequest): Promise<AddProjectListProjecyUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) return left(new ProjectNotFoundError())

    const listProject = await this.listProjectRepository.findById(listProjectId)

    if (!listProject) return left(new ListProjectNotFoundError())

    if (listProject.customerId.toString() !== project.customerId.toString())
      return left(
        new BadRequestException(
          'O cliente do projeto e da lista de projetos deve ser o mesmo.',
        ),
      )

    const shouldSaveUpdateDate =
      listProjectId !== project.listProjectsId.toString()

    await this.projectRepository.addProjectList(
      projectId,
      listProjectId,
      shouldSaveUpdateDate,
    )

    await this.projectRepository.finishOrActive(projectId, listProject.isDone)

    return right({ listProjectId })
  }
}
