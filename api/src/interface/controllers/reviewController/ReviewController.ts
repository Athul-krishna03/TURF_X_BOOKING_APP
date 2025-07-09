import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { IAddReviewUseCase } from "../../../entities/useCaseInterfaces/review/IAddReviewUseCase";
import { IGetReviewUseCase } from "../../../entities/useCaseInterfaces/review/IGetReviewUseCase";


@injectable()
export class ReviewController{
    constructor(
        @inject("IAddReviewUseCase")private _addShopReviewUseCase: IAddReviewUseCase,
        @inject("IGetReviewUseCase") private _getReviewUseCase :IGetReviewUseCase

    ) {}

    async addReview(req: Request, res: Response): Promise<void> {
        try {
        const userId= (req as CustomRequest).user.id;
        const { turfId, rating, reviewText } = req.body;
        await this._addShopReviewUseCase.execute(
            turfId,
            userId,
            rating,
            reviewText
        );

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: SUCCESS_MESSAGES.REVIEW_ADDED,
        });
        } catch (error) {
        handleErrorResponse(res, error);
        }
    }

    async getReview(req:Request,res:Response):Promise<void>{
        try {
            const {turfId} = req.query as {turfId:string}
            const reviews =await this._getReviewUseCase.execute(turfId);
            if(reviews){
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                    reviews
                });
                return
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: ERROR_MESSAGES.REQUEST_NOT_FOUND
                });
            }
            
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
}
