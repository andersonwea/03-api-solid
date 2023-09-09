import { CheckInRepository } from '@/repositories/check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'

describe('Check-In Use Case', () => {
  let checkInRepository: CheckInRepository
  let gymRepository: GymsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    gymRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2947712,
      userLongitude: -46.7337216,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not to be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2947712,
      userLongitude: -46.7337216,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.2947712,
        userLongitude: -46.7337216,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2947712,
      userLongitude: -46.7337216,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2947712,
      userLongitude: -46.7337216,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
