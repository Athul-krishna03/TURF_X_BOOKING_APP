import { Response,Request } from "express";
import { inject, injectable } from "tsyringe";
import { IBookingController } from "../../../entities/controllerInterfaces/booking/IBookingController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetUserBookingDetialsUseCase } from "../../../entities/useCaseInterfaces/user/IGetUserBookingDetialsUseCase";
import { IJoinGameUseCase } from "../../../entities/useCaseInterfaces/booking/IJoinGameUseCase";
import { IGetAllBookingDataUseCase } from "../../../entities/useCaseInterfaces/turf/IGetAllBookingDataUseCase";
import { IGetJoinedGameDetialsUseCase } from "../../../entities/useCaseInterfaces/user/IGetJoinedGameDetialsUseCase";
import { INormalGameCancelUseCase } from "../../../entities/useCaseInterfaces/booking/INormalGameCancelUseCase";
import { ICancelGameUseCase } from "../../../entities/useCaseInterfaces/booking/ICancelGameUseCase";
import { ICancelGameTurfSideUseCase } from "../../../entities/useCaseInterfaces/booking/ICancelGameTurfSideUseCase";
import { ITurfDashBoardUseCase } from "../../../entities/useCaseInterfaces/booking/ITurfDashBoardUseCase";
import { IAdminDashBoardUseCase } from "../../../entities/useCaseInterfaces/booking/IAdminDashBoardUseCase";
import { IGetRevenueDataUseCase } from "../../../entities/useCaseInterfaces/admin/IGetRevenueDataUseCase";


@injectable()
export  class BookingController implements IBookingController{
    constructor(
        @inject("IGetUserBookingDetialsUseCase") private _getUserBookingDetialsUseCase:IGetUserBookingDetialsUseCase,
        @inject("IJoinGameUseCase") private _joinGameUseCase:IJoinGameUseCase,
        @inject("IGetAllBookingDataUseCase") private _getAllBookingUseCase:IGetAllBookingDataUseCase,
        @inject("IGetJoinedGameDetialsUseCase") private _joinedGameDetials:IGetJoinedGameDetialsUseCase,
        @inject("INormalGameCancelUseCase") private _normalGameCancel:INormalGameCancelUseCase,
        @inject("ICancelGameUseCase") private _cancelGameUseCase:ICancelGameUseCase,
        @inject("ICancelGameTurfSideUseCase") private _cancelGameTurfSideUseCase:ICancelGameTurfSideUseCase,
        @inject("ITurfDashBoardUseCase") private _getTurfDashBoardUseCase:ITurfDashBoardUseCase,
        @inject("IAdminDashBoardUseCase") private _getAdminDashBoardUseCase:IAdminDashBoardUseCase,
        @inject("IGetRevenueDataUseCase") private _getRevenueDataUseCase:IGetRevenueDataUseCase
        

    ){}
    async getAllBooking(req:Request,res:Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id
            const bookings = await this._getUserBookingDetialsUseCase.execute(userId);
            if(!bookings){
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Error in fetching booking detials" 
                })
            }else{
                res.status(HTTP_STATUS.OK).json({
                    success:true,
                    message:"booking detials found",
                    data:bookings
                })
            }
        } catch (error) {
            handleErrorResponse(res,error)
        }        
    }

    async joinGame(req:Request,res:Response): Promise<void>{
        try {
            const userId = (req as CustomRequest).user.id;
            const {date,slotId,price} = req.body as {date:string,slotId:string,price:number};
            const data={
                userId,
                date,
                slotId,
                price
            }
            const bookingData = await this._joinGameUseCase.execute(data);
            
            if(!bookingData){
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    message:"join the game failed",
                })
                return 
            }
            const message = bookingData.status === 'Confirmed' ? 'Game confirmed and locked!' : 'Successfully joined the game';
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message,
                bookingData
            })
            return 
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
    async getAllBookingData(req:Request, res:Response):Promise<void>{
        const userId = (req as CustomRequest).user.id;
        const data = await this._getAllBookingUseCase.execute(userId);
        if(data){
            res.status(HTTP_STATUS.OK).json({
                success:true,
                data
            })
            return 
        }else{
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"join the game failed",
            })
            return 
        }
    }

    async getJoinedGameDetials(req:Request,res:Response):Promise<void>{
        const { bookingId } = req.query as {bookingId:string}
        const joinedGameDetials = await this._joinedGameDetials.execute(bookingId);
        if(!joinedGameDetials){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success:false,
                message:SUCCESS_MESSAGES.FAILED_DATA_FETCH
            })
            return 
        }else{
            res.status(HTTP_STATUS.OK).json({
                success:true,
                joinedGameDetials
            })
        }
    }
    
    async normalGameCancel(req:Request,res:Response):Promise<void>{
        const {bookingId,bookingType} = req.body as {bookingId:string,bookingType:string};
        const result = await this._normalGameCancel.execute(bookingId);
        if(!result){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success:false,
                message:SUCCESS_MESSAGES.FAILED_DATA_FETCH
            })
            return
        }else{
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:"Game cancelled successfully",
                data:result
            })
        }
    }

    async cancelJoinedGame(req:Request,res:Response):Promise<void>{
        try{
            const userId = (req as CustomRequest).user.id;
            const {bookingId,isHost} = req.body as {bookingId:string,isHost:boolean};
            if (!bookingId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Missing bookingId',
            });
            return;
        }

        const bookingData = await this._cancelGameUseCase.execute({
            bookingId,
            userId,
            isHost 
        })

        if (!bookingData) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to cancel the game',
        });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: isHost ? 'Booking canceled by host' : 'Slot canceled successfully',
            data: bookingData,
        });

        }catch(error){
            console.error('Cancel game error:', error);
            handleErrorResponse(res, error);
        }
    }

    async cancelBookingTurfOWner(req:Request,res:Response):Promise<void>{
        try {
            const {bookingId , bookingType }= req.body as {bookingId :string , bookingType:string};
            if (!bookingId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Missing bookingId',
                });
                return;
            }

            const bookingData = await this._cancelGameTurfSideUseCase.execute(bookingId, bookingType);
            if (!bookingData) {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to cancel the game',
                });
                return;
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Booking canceled successfully',
                data: bookingData,
            });
        } catch (error) {
            console.error('Cancel booking turf owner error:', error);
            handleErrorResponse(res, error);
        }
        
    }

    async getTurfDashBoardData(req: Request, res: Response): Promise<void> {
        try {
            const turfId = (req as CustomRequest).user.id;
            const dashBoardData = await this._getTurfDashBoardUseCase.execute(turfId);
            if(!dashBoardData){
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success:false,
                    message:SUCCESS_MESSAGES.FAILED_DATA_FETCH
                })
                return 
            }else{
                res.status(HTTP_STATUS.OK).json({
                    success:true,
                    dashBoardData
                })
            }
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    async getAdminDashBoardData(req: Request, res: Response): Promise<void> {
        try {
            const adminId = (req as CustomRequest).user.id;
            const dashBoardData = await this._getAdminDashBoardUseCase.execute(adminId);
            if(!dashBoardData){
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success:false,
                    message:SUCCESS_MESSAGES.FAILED_DATA_FETCH
                })
                return 
            }else{
                res.status(HTTP_STATUS.OK).json({
                    success:true,
                    dashBoardData
                })
            }
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    async getRevenueData(req:Request,res:Response):Promise<void>{
        try {
            const revenueData = await this._getRevenueDataUseCase.execute()
            if(!revenueData){
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success:false,
                    message:SUCCESS_MESSAGES.FAILED_DATA_FETCH
                })
                return 
            }else{
                res.status(HTTP_STATUS.OK).json({
                    success:true,
                    revenueData
                })
            }
        } catch (error) {
            handleErrorResponse(res,error)
        }
        
    }
}