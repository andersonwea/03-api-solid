import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCreadentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepository)
})

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jdoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'jdoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jdoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCreadentialsError)
  })

  it('should not able to athenticate with wrong passwords', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jdoe@example.com',
      password_hash: await hash('123123', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'jdow@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCreadentialsError)
  })
})
