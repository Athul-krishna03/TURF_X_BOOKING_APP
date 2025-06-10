import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { ISaveFCMTokenUseCase } from "../../entities/useCaseInterfaces/user/ISaveFCMTokenUseCase";



@injectable()
export class SaveFCMTokenUseCase implements ISaveFCMTokenUseCase{
    constructor(
        @inject("IClientRepository") private clientrepository:IClientRepository,
    ){}
    async execute(userId: string, token: string): Promise<void> {
        await this.clientrepository.updateFcmToken(userId,token);
    }
}