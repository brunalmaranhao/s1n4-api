import { UseCaseError } from '@/core/errors/use-case-error'

export class EmojiNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Emoji not found.`)
  }
}
