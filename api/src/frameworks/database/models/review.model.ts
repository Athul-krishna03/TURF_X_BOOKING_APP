import { Document, model, ObjectId } from "mongoose";
import { IReviewEntity } from "../../../entities/models/Review.entity";
import { reviewSchema } from "../schemas/review.Schema";


export interface IReviewModel extends IReviewEntity, Document {
    _id: ObjectId;
}

export const ReviewModel = model<IReviewModel>("Review", reviewSchema);
