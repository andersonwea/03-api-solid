import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-ins'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

describe('Validade Check-in Use Case', () => {
  let checkInsRepository: CheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn: checkInValidated } = await sut.execute({
      checkInId: checkIn.id,
    })

    expect(checkInValidated.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate a inexistent check-in', async () => {
    expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate check-ins after 20 minutes its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 30, 13, 40))

    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    expect(() =>
      sut.execute({
        checkInId: checkIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
