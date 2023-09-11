import { GymsRepository } from '@/repositories/gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('Search Gyms Use Case', () => {
  let gymsRepository: GymsRepository
  let sut: FetchNearbyGymsUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -23.2541655,
      longitude: -46.7354382,
    })

    await gymsRepository.create({
      title: 'Far away gym',
      description: null,
      phone: null,
      latitude: -23.196955,
      longitude: -46.8758778,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.2541655,
      userLongitude: -46.7354382,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
