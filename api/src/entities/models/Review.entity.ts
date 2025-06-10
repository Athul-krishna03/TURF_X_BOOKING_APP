export interface IReviewEntity {
	reviewId?: string;
	reviewerId: string;
	turfId: string;
	rating: number;
	reviewText?: string;
	createdAt: Date;
}