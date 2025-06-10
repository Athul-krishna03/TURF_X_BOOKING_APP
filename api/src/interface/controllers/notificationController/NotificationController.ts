import { Response ,Request , RequestHandler} from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { inject, injectable } from "tsyringe";
import { IGetAllNotificationUseCase } from "../../../entities/useCaseInterfaces/notifications/IGetAllNotificationUseCase";
import { IUpdateNotificationUseCase } from "../../../entities/useCaseInterfaces/notifications/IUpdateNotificationUseCase";


@injectable()
export class NotificationController {
    constructor(
        @inject("IGetAllNotificationUseCase") private _getAllNotificationUseCase:IGetAllNotificationUseCase,
        @inject("IUpdateNotificationUseCase") private _updateNotificationUsecase:IUpdateNotificationUseCase
    ) {}

    async getNotifcations(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;
            const data = await this._getAllNotificationUseCase.execute(userId);
            res.status(HTTP_STATUS.OK).json({data})
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
    async updateNotification(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as CustomRequest).user.id;
        const { id, all } = req.body;
        if (!id && !all) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }

        if (id) {
            await this._updateNotificationUsecase.execute(userId, id);
        } else if (all) {
            await this._updateNotificationUsecase.execute(userId, undefined, all);
        }

        res.status(HTTP_STATUS.OK).json({ message: SUCCESS_MESSAGES.ACTION_SUCCESS });

    } catch (error) {
        handleErrorResponse(res, error);
    }
}

}