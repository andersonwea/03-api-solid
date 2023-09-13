import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { history } from './history'
import { metrics } from './metrics'
import { create } from './create'
import { validate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-in/history', history)
  app.get('/check-in/metrics', metrics)

  app.post('/check-in/:gymId/check-ins', create)
  app.patch('/check-in/:checkInId/validate', validate)
}
