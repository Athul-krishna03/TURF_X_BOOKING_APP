import { Response ,Request , RequestHandler} from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interface/middlewares/authMiddleware";
import { BaseRoute } from "../baseRoute";
import { authController, blockStatusMiddleware, bookingController, chatRoomControllers, notificationController, paymentController, reviewController, slotController, turfController, userController } from "../../di/resolver";




export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

        this.router.post(
            "/user/refresh-token",
            decodeToken,
            (req:Request,res:Response)=>{
            console.log("refresh Token triggered");
            authController.refreshToken(req,res);
            }
        ),
        this.router.post(
            "/user/savefcm-token",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
                userController.saveFcmToken(req, res);
            }
        )
        this.router.post(
            "/user/logout",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                console.log("logout");
                authController.logout(req,res)
                
            }
        ),

        this.router.patch(
            "/user/edit-profile",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                console.log("edit user");
                userController.editUser(req,res)
                
            }
        ),

        this.router.patch(
            "/user/change-password",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                userController.updateUserPassword(req,res);
            }
        ),
        this.router.get(
            "/user/get-Turfs",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                turfController.getAllTurfs(req,res)
            }
        ),
        this.router.get(
            "/user/slots",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                turfController.getSlots(req,res);
            }
        ),
        this.router.post(
            "/user/payments/create-payment-intent",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                paymentController.createPaymentIntent(req,res);
            }
        ),
        this.router.post(
            "/user/slots",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                slotController.updateSlot(req,res)
            }
        ),
        this.router.get(
            "/user/bookings",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                bookingController.getAllBooking(req,res);
            }
        ),
        this.router.get(
            "/user/getSlot",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                slotController.getSlot(req,res);
            }
        ),
        this.router.get(
            "/user/hosted-games",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                turfController.getAllHostedGames(req,res)
            }
        ),
        this.router.post(
            "/user/joinSlot",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                bookingController.joinGame(req,res)
            }
        ),
        this.router.get(
            "/user/joinedGameDetials",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                bookingController.getJoinedGameDetials(req,res)
            }
        ),
        this.router.patch(
            "/user/cancelSingleSlot",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                bookingController.normalGameCancel(req,res)
            }
        ),
        this.router.patch(
            "/user/cancelJoinedGame",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                bookingController.cancelJoinedGame(req,res)
            }
        ),
        this.router.get(
            "/user/wallet",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                userController.getWalletDetails(req,res)
            }
        ),

        // chat room routes
        this.router.get(
            "/user/getChatRooms",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                chatRoomControllers.getChatRooms(req,res)
            }
        )

        this.router.post(
            "/user/createChatRoom",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                chatRoomControllers.createChatRoom(req,res)
            }
        ),
        this.router.get(
            "/user/getChatRoomByGameId",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                chatRoomControllers.getChatRoomByGameId(req,res)
            }
        ),

          // get all notification 
        this.router.get(
            '/user/notification',
            verifyAuth,
            authorizeRole(['user']),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                notificationController.getNotifcations(req,res)
            }
        )

    // mark notification as read
        this.router.patch(
            "/user/notification",
            verifyAuth,
            authorizeRole(["user"]),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req:Request,res:Response)=>{
                notificationController.updateNotification(req,res);
            }
        )

        //review routes

        this.router.post(
        "/user/review",
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
            reviewController.addReview(req, res);
        }
        )

        this.router.get(
            "/user/getReview",
            verifyAuth,
            authorizeRole(['user']),
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
                reviewController.getReview(req, res);
            }
        )
    }

    
}