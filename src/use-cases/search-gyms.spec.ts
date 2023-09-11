import { GymsRepository } from '@/repositories/gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'

describe('Search Gyms Use Case', () => {
  let gymsRepository: GymsRepository
  let sut: SearchGymsUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript gym',
      description: null,
      phone: null,
      latitude: -23.2541655,
      longitude: -46.7354382,
    })

    await gymsRepository.create({
      title: 'TypeScript gym',
      description: null,
      phone: null,
      latitude: -23.2541655,
      longitude: -46.7354382,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript gym' })])
  })

  it('should be able to search pagineted gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.2541655,
        longitude: -46.7354382,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript gym 21' }),
      expect.objectContaining({ title: 'JavaScript gym 22' }),
    ])
  })
})
