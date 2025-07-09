import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IReviewRepository } from "../../entities/repositoryInterface/review/review-reposistory.interface";
import { generateUniqueUid } from "../../frameworks/security/uniqueuid.bcrypt";
import { IAddReviewUseCase } from "../../entities/useCaseInterfaces/review/IAddReviewUseCase";

@injectable()
export class AddReviewUseCase implements IAddReviewUseCase {
    constructor(
        @inject("IReviewRepository")
        private _reviewRepository: IReviewRepository
    ) {}

    async execute(
        turfId: string,
        userId: string,
        rating: number,
        reviewText: string
    ): Promise<void> {
        const isReviewExisting = await this._reviewRepository.findOne({
        turfId,
        reviewerId: userId,
        });      
        if (isReviewExisting) {
        throw new CustomError(
            ERROR_MESSAGES.REVIEW_EXISTING,
            HTTP_STATUS.BAD_REQUEST
        );
        }

        await this._reviewRepository.save({
        reviewId: generateUniqueUid("review"),
        turfId,
        reviewerId: userId,
        rating,
        reviewText,
        createdAt: new Date(),
        });
    }
}
