import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

describe('Get User Metrics Use Case', () => {
  let checkInsRepository: CheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  it('should be albe to get check-ins count', async () => {
    vi.setSystemTime(new Date(2022, 0, 30, 8, 0, 0))

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    vi.setSystemTime(new Date(2022, 0, 29, 8, 0, 0))

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
