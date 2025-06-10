import { latestReviews } from "../../repositoryInterface/review/review-reposistory.interface";

export interface IGetReviewUseCase{
    execute(turfId: string): Promise<latestReviews[]>
}