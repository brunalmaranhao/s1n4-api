import { UseCaseError } from '@/core/errors/use-case-error'

export class UploadError extends Error implements UseCaseError {
  constructor(error: unknown) {
    super(`Upload error. Body: ${error}`)
  }
}
