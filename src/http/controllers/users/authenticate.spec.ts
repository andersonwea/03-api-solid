import { afterAll, beforeAll, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

test('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jdoe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'jdoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
