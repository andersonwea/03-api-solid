import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCreadentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCreadentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
