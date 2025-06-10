import { IReviewEntity } from "../../models/Review.entity";
import { IBaseRepository } from "../IBase-repository-interface";

export interface latestReviews{
    reviewId: string;
    clientName: string;
    clientAvatar?: string;
    rating: number;
    comment?: string;
    createdAt: string;
}
export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
    findOne({ turfId, reviewerId }: { turfId: string; reviewerId: string }): Promise<IReviewEntity | null>
    getReviewStatsByTurfId({
        turfId,
    }: {
        turfId: string;
    }): Promise<{ averageRating: number; totalReviews: number }>;

    getLatestReviews(
        turfId: string
        ): Promise<latestReviews[]>
}