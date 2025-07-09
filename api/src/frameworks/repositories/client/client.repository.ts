import { inject, injectable } from "tsyringe";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel, IClientModel } from "../../database/models/client.model";
import { IClientRepository } from "../../../entities/repositoryInterface/client/IClient-repository.interface";
import { userSignupSchemas } from "../../../interface/controllers/validations/user-signup.validation.schema";
import { ClientProfileResponse } from "../../../shared/responseTypes/clientProfileResponse";
import { BaseRepository } from "../base.repository";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ClientRepository
  extends BaseRepository<IClientModel>
  implements IClientRepository
{
  constructor() {
    super(ClientModel);
  }
  async findByEmail(email: string): Promise<IClientEntity | null> {
    const client = await ClientModel.findOne({ email }).lean();
    if (!client) return null;

    return {
      ...client,
      id: client._id.toString(),
    } as IClientEntity;
  }

  async find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ users: IClientEntity[] | []; total: number }> {
    const users = await ClientModel.find({ role: "user", ...filter })
      .skip(skip)
      .limit(limit);
    const totalUsers = await ClientModel.countDocuments({
      role: "user",
      ...filter,
    });
    return { users, total: totalUsers };
  }

  async findByIdAndUpdateStatus(id: string): Promise<void> {
    const user = await ClientModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updateStatus = !user.isBlocked;
    const result = await ClientModel.findByIdAndUpdate(id, {
      $set: { isBlocked: updateStatus },
    });
  }

  async findById(id: string): Promise<IClientEntity | null> {
    const user = await ClientModel.findById({ _id: id });
    return user ? user : null;
  }

  async updateProfileById(
    id: string,
    data: Partial<IClientEntity>
  ): Promise<ClientProfileResponse> {
    const updateProfile = await ClientModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
      }
    )
      .select(
        "name phone profileImage position email walletBalance joinedAt role"
      )
      .exec();

    if (!updateProfile) {
      throw new Error("Profile not found");
    }

    return updateProfile as unknown as ClientProfileResponse;
  }
  async findByIdAndUpdatePassWord(id: string, password: string): Promise<void> {
    const updatePass = await ClientModel.findByIdAndUpdate(
      { _id: id },
      { $set: { password: password } },
      { new: true }
    );

    if (!updatePass) {
      throw new Error("Profile not found to update pass");
    }

    return;
  }

  async findByIdAndUpdateWallet(
    id: string,
    amount: number
  ): Promise<IClientEntity | null> {
    const user = await ClientModel.findByIdAndUpdate(id, {
      $inc: { walletBalance: amount },
    })
      .select(
        "name phone profileImage position email walletBalance joinedAt role"
      )
      .exec();
    if (!user) {
      throw new Error("User not found to update wallet");
    }
    return user as IClientEntity;
  }

  async updateFcmToken(id: string, fcmToken: string): Promise<void> {
    const result = await ClientModel.findByIdAndUpdate(id, {
      $set: { fcmToken },
    });
    if (!result) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
  async revokeFcmToken(id: string): Promise<void> {
    const result = await ClientModel.findByIdAndUpdate(id, {
      $unset: { fcmToken: "" },
    });
    if (!result) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
}
