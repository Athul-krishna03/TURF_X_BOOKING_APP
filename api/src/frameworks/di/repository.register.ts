import { container } from "tsyringe";

//respoitory imports
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { ClientRepository } from "../repositories/client/client.repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/IRefreshToken_RepositoryInterface";
import { RefreshTokenRepository } from "../repositories/auth/refreshTokenRepository";
import { ITokenService } from "../../entities/services/ITokenServices";
import { JWTService } from "../../interface/services/JwtTokenService";
import { IUserExistenceService } from "../../entities/services/Iuser-existence-service.interface";
import { UserExistenceService } from "../../interface/services/UserExistenceServices";
import { IOtpService } from "../../entities/services/IOtpServices";
import { OtpService } from "../../interface/services/OtpService";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { NodemailerService } from "../../interface/services/NodeMailerServices";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { RedisClient } from "../redis/redisClient";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { TurfRepository } from "../repositories/Turf/turf.repository";
import { IRedisTokenRepository } from "../../entities/repositoryInterface/redis/IRedisTokenRepository";
import { RedisTokenRepository } from "../repositories/redis/RedisTokenRepository";
import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";
import { SlotRepository } from "../repositories/Turf/slot.repository";
import { Server } from "../http/server";
import { MongoConnect } from "../database/mongoDB/mongoConnect";
import { ISlotService } from "../../entities/services/ISlotService";
import { SlotService } from "../../interface/services/SlotServices";
import { BookingRepository } from "../repositories/booking/booking.repository";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IPaymentService } from "../../entities/services/IPaymentService";
import { PaymentService } from "../../interface/services/PaymentService";
import { IPaymentGateway } from "../../entities/services/IPaymentGateway";
import { StripePaymentGateway } from "../../interface/services/StripePaymentService";
import { IWalletRepository } from "../../entities/repositoryInterface/wallet/IWalletRepository";
import { WalletRepository } from "../repositories/wallet/wallet.repository";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";
import { ChatRoomRepository } from "../repositories/ChatRoom/chatRoom.repository";
import { IMessageRepository } from "../../entities/repositoryInterface/chatRoom/message-repository";
import { MessageRepository } from "../repositories/ChatRoom/message.repository";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";
import { NotificationRepository } from "../repositories/notification/notification.repository";
import { IReviewRepository } from "../../entities/repositoryInterface/review/review-reposistory.interface";
import { ReviewRepository } from "../repositories/review/ReviewRepository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });
    container.register<ITurfRepository>("ITurfRepository", {
      useClass: TurfRepository,
    });
    container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
      useClass: RefreshTokenRepository,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });
    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });
    container.register<INodemailerService>("INodemailerService", {
      useClass: NodemailerService,
    });
    container.register<IRedisClient>("IRedisClient", {
      useClass: RedisClient,
    });
    container.register<IRedisTokenRepository>("IRedisTokenRepository", {
      useClass: RedisTokenRepository,
    });
    container.register<ISlotRepository>("ISlotRepository", {
      useClass: SlotRepository,
    });

    container.register<ISlotService>("ISlotService", {
      useClass: SlotService,
    });

    container.register<IPaymentService>("IPaymentService", {
      useClass: PaymentService,
    });

    container.register<IPaymentGateway>("IPaymentGateway", {
      useClass: StripePaymentGateway,
    });
    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });
    container.register<IWalletRepository>("IWalletRepository", {
      useClass: WalletRepository,
    });
    container.register<IChatRoomRepository>("IChatRoomRepository", {
      useClass: ChatRoomRepository,
    });

    container.register<IMessageRepository>("IMessageRepository", {
      useClass: MessageRepository,
    });

    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });

    container.register<IReviewRepository>("IReviewRepository", {
      useClass: ReviewRepository,
    });
    container.register<Server>("Server", {
      useClass: Server,
    });
    container.register<MongoConnect>("MongoConnect", {
      useClass: MongoConnect,
    });
  }
}
