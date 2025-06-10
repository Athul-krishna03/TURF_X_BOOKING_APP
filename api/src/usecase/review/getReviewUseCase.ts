import { inject , injectable} from "tsyringe";
import { IGetReviewUseCase } from "../../entities/useCaseInterfaces/review/IGetReviewUseCase";
import { IReviewRepository, latestReviews } from "../../entities/repositoryInterface/review/review-reposistory.interface";

@injectable()
export class GetReviewUseCase implements IGetReviewUseCase{
    constructor(
        @inject("IReviewRepository")
        private _reviewRepository: IReviewRepository
    ) {}
    
    async execute(turfId: string): Promise<latestReviews[]>{
        return this._reviewRepository.getLatestReviews(turfId)
    }
}
