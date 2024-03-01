export class UserValidationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'UserValidationError'
  }
}

export class UnauthorizedError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
