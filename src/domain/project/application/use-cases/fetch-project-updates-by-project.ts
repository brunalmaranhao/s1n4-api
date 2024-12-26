import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface FetchProjectUpdateByProjectUseCaseRequest {
  projectId: string
  userId: string
}

type FetchProjectUpdateByProjectUseCaseResponse = Either<
  ForbiddenException,
  {
    projectUpdates: ProjectUpdate[]
  }
>

@Injectable()
export class FetchProjectUpdateByProjectUseCase {
  constructor(
    private projectRepository: ProjectUpdateRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    projectId,
    userId,
  }: FetchProjectUpdateByProjectUseCaseRequest): Promise<FetchProjectUpdateByProjectUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    const projectUpdates =
      await this.projectRepository.fetchByProjectId(projectId)

    if (
      user?.role.startsWith('CLIENTE') &&
      projectUpdates[0].project?.customerId.toString() !==
        user.customerId?.toString()
    ) {
      return left(new ForbiddenException())
    }

    return right({
      projectUpdates,
    })
  }
}
