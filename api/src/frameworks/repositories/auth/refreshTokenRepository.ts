import { injectable } from "tsyringe";
import { IRefreshTokenRepository } from "../../../entities/repositoryInterface/auth/IRefreshToken_RepositoryInterface";
import { TRole } from "../../../shared/constants";
import { RefreshTokenModel } from "../../database/schemas/refresh-token-schema";
import { IRefreshTokenEntity } from "../../../entities/models/refresh.token.entity";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async save(data: {
    token: string;
    userType: TRole;
    user: string;
    expiresAt: number;
  }): Promise<void> {
    await RefreshTokenModel.create({
      token: data.token,
      userType: data.userType,
      user: data.user,
      expiresAt: data.expiresAt,
    });
  }
  async find(token: string): Promise<IRefreshTokenEntity | null> {
    const doc = await RefreshTokenModel.findOne({ token: token });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      token: doc.token,
      user: doc.user as unknown as string,
      userType: doc.userType,
      expiresAt: doc.expiresAt,
    };
  }
  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token });
  }
}
