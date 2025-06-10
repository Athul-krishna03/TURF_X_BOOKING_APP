import {container} from 'tsyringe'

import {DependencyInjection} from "."
import { BlockStatusMiddleware } from '../../interface/middlewares/blockstatusMiddleware';

// Controller Import 
import { AuthController } from '../../interface/controllers/auth/AuthControllers'
import { UserController } from '../../interface/controllers/users/userController';
import { TurfControllers } from '../../interface/controllers/turf/TurfControllers';
import { PaymentController } from '../../interface/controllers/payment/PaymentController';
import { SlotController } from '../../interface/controllers/slotControllers/SlotControllers';
import { BookingController } from '../../interface/controllers/bookingController/BookingControllers';
import { ChatRoomControllers } from '../../interface/controllers/chatRoomController/ChatRoomController';
import { NotificationController } from '../../interface/controllers/notificationController/NotificationController';
import { ReviewController } from '../../interface/controllers/reviewController/ReviewController';


DependencyInjection.registerAll();

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);
export const authController = container.resolve(AuthController);
export const userController=container.resolve(UserController);
export const turfController = container.resolve(TurfControllers);
export const paymentController = container.resolve(PaymentController);
export const slotController = container.resolve(SlotController);
export const bookingController = container.resolve(BookingController);
export const chatRoomControllers = container.resolve(ChatRoomControllers);
export const notificationController = container.resolve(NotificationController);
export const reviewController = container.resolve(ReviewController);
