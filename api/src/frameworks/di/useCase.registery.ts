import { container } from "tsyringe";

//bcrypt Imports

import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";

//strategy import
import { ClientLoginStrategy } from "../../usecase/auth/login-strategies/clientLoginStrategy";
import { ClientRegisterStrategy } from "../../usecase/auth/register-stratergies/client-register.strategy";
import { TurfRegisterStrategy } from "../../usecase/auth/register-stratergies/Turf-register.strategy";
import { TurfLoginStrategy } from "../../usecase/auth/login-strategies/TurfLoginStrategy";
//useCase Imports

import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/IRegister-usecase.interface";
import { RegisterUserUsecase } from "../../usecase/register-user-usecase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/ILoginUserUseCase";
import { LoginUserUseCase } from "../../usecase/LoginUserUseCase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateTokenUseCase";
import { GenerateTokenUseCase } from "../../usecase/GenerateTokenUseCase";
import { IGenerateOtpUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { GenerateOtpUseCase } from "../../usecase/auth/register-stratergies/GenerateOtpUseCase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpUseCase } from "../../usecase/auth/register-stratergies/VerifyOtp.useCase";
import { GoogleAuthUseCase } from "../../usecase/auth/GoogleAuthUseCase";
import { IGoogleAuthUseCase } from "../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/admin/IGetAllUserUseCase";
import { GetAllUsersUseCase } from "../../usecase/admin/GetAllUserUseCase";
import { IGetAllTurfUseCase } from "../../entities/useCaseInterfaces/admin/IGetAllTurfsUseCase";
import { GetAllTurfsUseCase } from "../../usecase/admin/GetAllTurfsUseCase";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateUserStatusUseCase";
import { UpdateUserStatusUseCase } from "../../usecase/admin/UpdateUserStatusUseCase";
import { IUpdateTurfStatusUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateTurfStatusUseCase";
import { UpdateTurfStatusUseCase } from "../../usecase/admin/UpdateTurfStatusUseCase";
import { IGetAllTurfRequestsUseCase } from "../../entities/useCaseInterfaces/admin/IGetAllTurfRequestsUsecase";
import { GetAllTurfRequestsUseCase } from "../../usecase/admin/GetAllTurfRequestsUseCase";
import { IUpdateTurfRequestUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateTurfRequestUseCase";
import { UpdateTurfRequestUseCase } from "../../usecase/admin/UpdateTurfRequestUseCase";
import { IBlackListTokenUseCase } from "../../entities/repositoryInterface/auth/IBlackListTokenUseCase";
import { BlackListTokenUseCase } from "../../usecase/auth/BlackListTokenUseCase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../usecase/auth/RefreshTokenUseCase";
import { IUpdateProfileUseCase } from "../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { UpdateProfileUseCase } from "../../usecase/user/UpdateProfileUseCase";
import { IGenerateSlotUseCase } from "../../entities/useCaseInterfaces/turf/IGenerateSlotUseCase";
import { GenerateSlotUseCase } from "../../usecase/turf/GenerateSlotsUseCase";
import { IUpdateUserPassWordUseCase } from "../../entities/useCaseInterfaces/user/IUpdateUserPassWordUseCase";
import { UpdateUserPassWordUseCase } from "../../usecase/user/UpdateUserPasswordUseCase";
import { IUpdateTurfProfileUseCase } from "../../entities/useCaseInterfaces/turf/IUpdateTurfProfileUseCase";
import { UpdateTurfProfileUseCase } from "../../usecase/turf/UpdateTurfProfileUseCase";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeRefreshTokenUseCase";
import { RevokeRefreshTokenUseCase } from "../../usecase/auth/RevokeRefreshTokenUseCase";
import { IUpdateTurfPassWordUseCase } from "../../entities/useCaseInterfaces/turf/IUpdateTurfPasswordUseCase";
import { UpdateTurfPassWordUseCase } from "../../usecase/turf/UpdateTurfPasswordUseCase";
import { IGetSlotUseCase } from "../../entities/useCaseInterfaces/turf/IGetSlotUseCase";
import { GetSlotUseCase } from "../../usecase/turf/GetSlotsUseCase";
import { IDeleteExpiredSlotsUseCase } from "../../entities/useCaseInterfaces/IDeleteExpiredSlotsUseCase";
import { DeleteExpiredSlotsUseCase } from "../../usecase/slot/DeleteExpiredSlotsUseCase";
import { IBookingSlotUseCase } from "../../entities/useCaseInterfaces/IBookingSlotUseCase";
import { BookingSlotUseCase } from "../../usecase/booking/BookingSlotUseCase";
import { IGetUserBookingDetialsUseCase } from "../../entities/useCaseInterfaces/user/IGetUserBookingDetialsUseCase";
import { GetUserBookingDetialsUseCase } from "../../usecase/user/GetBookingDetialsUseCase";
import { IUpdateSlotStatusUseCase } from "../../entities/useCaseInterfaces/IUpdateSlotStatusUseCase";
import { UpdateSlotStatusUseCase } from "../../usecase/slot/UpdateSlotStatusUseCase";
import { IGetSlotDataUseCase } from "../../entities/useCaseInterfaces/slot/IGetSlotDataUseCase";
import { GetSlotDataUseCase } from "../../usecase/slot/GetSlotUseCase";
import { IGetAllHostedGamesUseCase } from "../../entities/useCaseInterfaces/turf/IGetAllHostedGamesUseCase";
import { GetAllHostedGamesUseCase } from "../../usecase/turf/GetAllHostedGamesUseCase";
import { IJoinGameUseCase } from "../../entities/useCaseInterfaces/booking/IJoinGameUseCase";
import { JoinGameUseCase } from "../../usecase/booking/JoinGameUseCase";
import { IGetAllBookingDataUseCase } from "../../entities/useCaseInterfaces/turf/IGetAllBookingDataUseCase";
import { GetAllBookingDataUseCase } from "../../usecase/turf/GetAllBookingDataUseCase";
import { IGetJoinedGameDetialsUseCase } from "../../entities/useCaseInterfaces/user/IGetJoinedGameDetialsUseCase";
import { GetJoinedGameDetials } from "../../usecase/user/GetJoinedGameDetialUseCase";
import { INormalGameCancelUseCase } from "../../entities/useCaseInterfaces/booking/INormalGameCancelUseCase";
import { NormalGameCancelUseCase } from "../../usecase/booking/NormalGameCancelUseCase";
import { ICancelGameUseCase } from "../../entities/useCaseInterfaces/booking/ICancelGameUseCase";
import { CancelGameUseCase } from "../../usecase/booking/CancelGameUseCase";
import { IDeleteUnfilledGamesUseCase } from "../../entities/useCaseInterfaces/IDeleteUnfilledGamesUseCase";
import { DeleteUnfilledGamesUseCase } from "../../usecase/slot/DeleteUnfilledGamesUseCase";
import { ICancelGameTurfSideUseCase } from "../../entities/useCaseInterfaces/booking/ICancelGameTurfSideUseCase";
import { CancelGameTurfSideUseCase } from "../../usecase/booking/CancelGameTurfSideUseCase";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { WalletServices } from "../../interface/services/WalletServices";
import { IGetUserWalletDetailsUseCase } from "../../entities/useCaseInterfaces/user/IGetUserWalletDetailsUseCase";
import { GetUserWalletDetailsUseCase } from "../../usecase/user/GetUserWalletDetailsUseCase";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chatRoom/ICreateChatRoomUseCase";
import { CreateChatRoomUseCase } from "../../usecase/chatRoom/CreateChatRoomUseCase";
import { ISendMessageUseCase } from "../../entities/useCaseInterfaces/chatRoom/ISendMessageUseCase";
import { SendMessageUseCase } from "../../usecase/chatRoom/SendMessageUseCase";
import { IGetChatRoomUseCase } from "../../entities/useCaseInterfaces/chatRoom/IGetChatRoomUseCase";
import { GetChatRoomUseCase } from "../../usecase/chatRoom/GetChatRoomUseCase";
import { ITurfDashBoardUseCase } from "../../entities/useCaseInterfaces/booking/ITurfDashBoardUseCase";
import { TurfDashBoardUseCase } from "../../usecase/booking/TurfDashBoardUseCase";
import { IDashBoardServices } from "../../entities/services/IDashBoardServices";
import { DashBoardServices } from "../../interface/services/DashBoardServices";
import { IAdminDashBoardUseCase } from "../../entities/useCaseInterfaces/booking/IAdminDashBoardUseCase";
import { AdminDashBoardUseCase } from "../../usecase/booking/AdminDashBoard";
import { IUpdateNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IUpdateNotificationUseCase";
import { UpdateNotificationUseCase } from "../../usecase/notification/UpdateNotificationUseCase";
import { IGetAllNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IGetAllNotificationUseCase";
import { GetAllNotificationUseCase } from "../../usecase/notification/GetAllNotificationUseCase";
import { ISaveFCMTokenUseCase } from "../../entities/useCaseInterfaces/user/ISaveFCMTokenUseCase";
import { SaveFCMTokenUseCase } from "../../usecase/user/SaveFCMTokenUseCase";
import { IPushNotificationService } from "../../entities/services/IPushNotificationService";
import { PushNotificationService } from "../../interface/services/FirebasePushNotificationService";
import { IGetChatRoomByGameIdUseCase } from "../../entities/useCaseInterfaces/chatRoom/IGetChatRoomByGameIdUseCase";
import { GetChatRoomByGameIdUseCase } from "../../usecase/chatRoom/GetChatRoomByGameIdUseCase";
import { IAddReviewUseCase } from "../../entities/useCaseInterfaces/review/IAddReviewUseCase";
import { AddReviewUseCase } from "../../usecase/review/addReviewUsecase";
import { IGetReviewUseCase } from "../../entities/useCaseInterfaces/review/IGetReviewUseCase";
import { GetReviewUseCase } from "../../usecase/review/getReviewUseCase";
import { IGetRevenueDataUseCase } from "../../entities/useCaseInterfaces/admin/IGetRevenueDataUseCase";
import { GetRevenueDataUseCase } from "../../usecase/admin/GetRevenueDataUseCase";
import { NewsApiService } from "../newsApi/NewsApiService";
import { register } from "module";
import { INewsApiService } from "../../entities/services/INewsApiService";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IForgotPasswordUseCase";
import { ForgotPasswordUseCase } from "../../usecase/auth/ForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../usecase/auth/ResetPasswordUseCase";

export class UseCaseRegistery {
  static registerUseCases(): void {
    //register bcrypts
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });

    //usecase Registers
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUsecase,
    });
    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });
    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<IGenerateOtpUseCase>("IGenerateOtpUseCase", {
      useClass: GenerateOtpUseCase,
    });

    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });

    container.register<IGoogleAuthUseCase>("IGoogleAuthUseCase", {
      useClass: GoogleAuthUseCase,
    });

    container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
      useClass: GetAllUsersUseCase,
    });

    container.register<IGetAllTurfUseCase>("IGetAllTurfUseCase", {
      useClass: GetAllTurfsUseCase,
    });

    container.register<IUpdateUserStatusUseCase>("IUpdateUserStatusUseCase", {
      useClass: UpdateUserStatusUseCase,
    });

    container.register<IUpdateTurfStatusUseCase>("IUpdateTurfStatusUseCase", {
      useClass: UpdateTurfStatusUseCase,
    });
    container.register<IGetAllTurfRequestsUseCase>(
      "IGetAllTurfRequestsUseCase",
      {
        useClass: GetAllTurfRequestsUseCase,
      }
    );

    container.register<IUpdateTurfRequestUseCase>("IUpdateTurfRequestUseCase", {
      useClass: UpdateTurfRequestUseCase,
    });

    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });

    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });
    container.register<IUpdateProfileUseCase>("IUpdateProfileUsecase", {
      useClass: UpdateProfileUseCase,
    });

    container.register<IGenerateSlotUseCase>("IGenerateSlotUseCase", {
      useClass: GenerateSlotUseCase,
    });

    container.register<IUpdateUserPassWordUseCase>(
      "IUpdateUserPassWordUseCase",
      {
        useClass: UpdateUserPassWordUseCase,
      }
    );

    container.register<IUpdateTurfPassWordUseCase>(
      "IUpdateTurfPassWordUseCase",
      {
        useClass: UpdateTurfPassWordUseCase,
      }
    );

    container.register<IUpdateTurfProfileUseCase>("IUpdateTurfProfileUseCase", {
      useClass: UpdateTurfProfileUseCase,
    });
    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );

    container.register<IGetSlotUseCase>("IGetSlotsUseCase", {
      useClass: GetSlotUseCase,
    });
    container.register<IDeleteExpiredSlotsUseCase>(
      "IDeleteExpiredSlotsUseCase",
      {
        useClass: DeleteExpiredSlotsUseCase,
      }
    );

    container.register<IBookingSlotUseCase>("IBookingSlotUseCase", {
      useClass: BookingSlotUseCase,
    });

    container.register<IGetUserBookingDetialsUseCase>(
      "IGetUserBookingDetialsUseCase",
      {
        useClass: GetUserBookingDetialsUseCase,
      }
    );

    container.register<IUpdateSlotStatusUseCase>("IUpdateSlotStatusUseCase", {
      useClass: UpdateSlotStatusUseCase,
    });

    container.register<IGetSlotDataUseCase>("IGetSlotDataUseCase", {
      useClass: GetSlotDataUseCase,
    });

    container.register<IGetAllHostedGamesUseCase>("IGetAllHostedGamesUseCase", {
      useClass: GetAllHostedGamesUseCase,
    });

    container.register<IJoinGameUseCase>("IJoinGameUseCase", {
      useClass: JoinGameUseCase,
    });
    container.register<IGetAllBookingDataUseCase>("IGetAllBookingDataUseCase", {
      useClass: GetAllBookingDataUseCase,
    });

    container.register<IGetJoinedGameDetialsUseCase>("IGetJoinedGameDetialsUseCase",{
      useClass:GetJoinedGameDetials
    })

    container.register<INormalGameCancelUseCase>("INormalGameCancelUseCase", {
      useClass:NormalGameCancelUseCase
    })

    container.register<ICancelGameUseCase>("ICancelGameUseCase", {
      useClass: CancelGameUseCase
    })

    container.register<IDeleteUnfilledGamesUseCase>("IDeleteUnfilledGamesUseCase", {
      useClass: DeleteUnfilledGamesUseCase,
    });

    container.register<ICancelGameTurfSideUseCase>("ICancelGameTurfSideUseCase", {
      useClass: CancelGameTurfSideUseCase,
    });

    container.register<IWalletSercvices>("IWalletSercvices", {
      useClass: WalletServices 
    });

    container.register<IDashBoardServices>("IDashBoardServices", { 
      useClass: DashBoardServices 
    });

    container.register<INewsApiService>("INewsApiService",{
      useClass:NewsApiService
    })

    container.register<IGetUserWalletDetailsUseCase>("IGetUserWalletDetailsUseCase", {
      useClass: GetUserWalletDetailsUseCase,
    });

    container.register<ICreateChatRoomUseCase>("ICreateChatRoomUseCase",{
      useClass:CreateChatRoomUseCase
    })

    container.register<ISendMessageUseCase>("ISendMessageUseCase",{
      useClass:SendMessageUseCase
    })

    container.register<IGetChatRoomUseCase>("IGetChatRoomUseCase",{
      useClass:GetChatRoomUseCase
    })

    container.register<ITurfDashBoardUseCase>("ITurfDashBoardUseCase",{
      useClass:TurfDashBoardUseCase
    })

    container.register<IAdminDashBoardUseCase>("IAdminDashBoardUseCase", {
      useClass: AdminDashBoardUseCase,
    });

    container.register<IUpdateNotificationUseCase>("IUpdateNotificationUseCase", {
      useClass: UpdateNotificationUseCase,
    });

    container.register<IGetAllNotificationUseCase>("IGetAllNotificationUseCase", {
      useClass: GetAllNotificationUseCase,
    });

    container.register<ISaveFCMTokenUseCase>("ISaveFCMTokenUseCase", {
      useClass: SaveFCMTokenUseCase,
    });

    container.register<IPushNotificationService>("IPushNotificationService",{
      useClass: PushNotificationService,
    })

    container.register<IGetChatRoomByGameIdUseCase>("IGetChatRoomByGameIdUseCase", {
      useClass: GetChatRoomByGameIdUseCase,
    });

    container.register<IAddReviewUseCase>("IAddReviewUseCase",{
      useClass:AddReviewUseCase
    })

    container.register<IGetReviewUseCase>("IGetReviewUseCase",{
      useClass:GetReviewUseCase
    })

    container.register<IGetRevenueDataUseCase>("IGetRevenueDataUseCase",{
      useClass:GetRevenueDataUseCase
    })
    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase",{
      useClass:ForgotPasswordUseCase
    })
    container.register<IResetPasswordUseCase>("IResetPasswordUseCase",{
      useClass:ResetPasswordUseCase
    })
    //Register Strategy
    container.register("ClientRegisterStrategy", {
      useClass: ClientRegisterStrategy,
    });
    container.register("ClientLoginStrategy", {
      useClass: ClientLoginStrategy,
    });
    container.register("TurfLoginStrategy", {
      useClass: TurfLoginStrategy,
    });
    container.register("TurfRegisterStrategy", {
      useClass: TurfRegisterStrategy,
    });
  }
}
