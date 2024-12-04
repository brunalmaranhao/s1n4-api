import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Uploader } from '../storage/uploader'
import { InvalidFileTypeError } from './errors/invalid-file'
import { UploadError } from './errors/upload-error'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { ProjectRepository } from '../repositories/project-repository'

interface UploadFileUseCaseRequest {
  type: string
  body: Buffer
  projectId: string
  label: string
}

type UploadFileUseCaseResponse = Either<
  InvalidFileTypeError | CustomerNotFoundError,
  {
    fileName: string
    url: string
  }
>

@Injectable()
export class UploadFileUseCase {
  constructor(
    private uploader: Uploader,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    type,
    body,
    projectId,
    label,
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    const mimePattern = /^application\/pdf$/
    if (!mimePattern.test(type)) {
      return left(new InvalidFileTypeError(type))
    }

    const customer = await this.projectRepository.findById(projectId)
    if (!customer) return left(new CustomerNotFoundError())
    const fileName = `${customer?.name.toLowerCase().replace(/\s+/g, '').trim()}-${label}`
    console.log(type)

    try {
      const { url } = await this.uploader.upload({
        fileName,
        fileType: type,
        body,
      })

      return right({
        url,
        fileName,
      })
    } catch (e: unknown) {
      return left(new UploadError(e))
    }
  }
}
