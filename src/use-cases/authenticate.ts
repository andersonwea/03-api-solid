import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { InvalidCreadentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'

interface AuthenticateCaseRequest {
  email: string
  password: string
}

interface AuthenticateCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateCaseRequest): Promise<AuthenticateCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCreadentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCreadentialsError()
    }

    return {
      user,
    }
  }
}
