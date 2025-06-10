export interface IAddReviewUseCase{
    execute(
        turfId: string,
        userId: string,
        rating: number,
        reviewText: string
    ): Promise<void>
}