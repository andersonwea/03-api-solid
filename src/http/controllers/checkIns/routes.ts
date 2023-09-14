import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { history } from './history'
import { metrics } from './metrics'
import { create } from './create'
import { validate } from './validate'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-in/history', history)
  app.get('/check-in/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)

  app.patch(
    '/check-in/:checkInId/validate',
    { onRequest: verifyUserRole('ADMIN') },
    validate,
  )
}
