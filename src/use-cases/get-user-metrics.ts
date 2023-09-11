import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsRequest {
  userId: string
}

interface GetUserMetricsResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private userRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.userRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
