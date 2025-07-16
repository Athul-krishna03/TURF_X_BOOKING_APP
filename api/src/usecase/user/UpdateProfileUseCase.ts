import { inject, injectable } from "tsyringe";
import { IUpdateProfileUseCase } from "../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { ClientProfileResponse } from "../../shared/responseTypes/clientProfileResponse";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @inject("IClientRepository") private clientRepo: IClientRepository
  ) {}
  async execute(
    clientId: string,
    data: Partial<IClientEntity>
  ): Promise<ClientProfileResponse> {
    
    const isExist = await this.clientRepo.findById(clientId);
    let isEmailEXist: IClientEntity | null = null;
    if (data.email) {
      isEmailEXist = await this.clientRepo.findByEmail(data.email);
      if (isEmailEXist && isEmailEXist.email !== data.email) {
        throw new CustomError(
          "user with same email exist",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    if (!isExist) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const updateProfile = await this.clientRepo.updateProfileById(
      clientId,
      data
    );

    if (!updateProfile) {
      throw new CustomError(
        "Failed to update the profile",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    return updateProfile;
  }
}
