import { injectable } from "tsyringe";
import {
  IReviewRepository,
  latestReviews,
} from "../../../entities/repositoryInterface/review/review-reposistory.interface";
import { IReviewModel, ReviewModel } from "../../database/models/review.model";
import { IReviewEntity } from "../../../entities/models/Review.entity";
import { BaseRepository } from "../base.repository";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReviewModel>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  async findOne({
    turfId,
    reviewerId,
  }: {
    turfId: string;
    reviewerId: string;
  }): Promise<IReviewEntity | null> {
    return await ReviewModel.findOne({ turfId, reviewerId }).lean();
  }

  async getReviewStatsByTurfId({
    turfId,
  }: {
    turfId: string;
  }): Promise<{ averageRating: number; totalReviews: number }> {
    const result = await ReviewModel.aggregate([
      {
        $match: { turfId },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return {
      averageRating: Number(result[0]?.averageRating?.toFixed(1) || 0),
      totalReviews: result[0]?.totalReviews || 0,
    };
  }

  async getLatestReviews(turfId: string): Promise<latestReviews[]> {
    return ReviewModel.aggregate([
      {
        $addFields: {
          reviewerObjId: { $toObjectId: "$reviewerId" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $match: { turfId } },
      { $limit: 5 },
      {
        $lookup: {
          from: "clients",
          localField: "reviewerObjId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          reviewId: "$_id",
          rating: 1,
          comment: "$reviewText",
          createdAt: 1,
          clientName: "$client.name",
          clientAvatar: "$client.profileImage",
        },
      },
    ]);
  }
}
