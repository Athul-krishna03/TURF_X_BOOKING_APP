import { inject, injectable } from "tsyringe";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";
import { ITokenService } from "../../entities/services/ITokenServices";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/IRefreshToken_RepositoryInterface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase{
    constructor(
        @inject('ITokenService') private _tokenService:ITokenService,
        @inject("IRefreshTokenRepository") private _refreshTokenRepository:IRefreshTokenRepository,
        @inject("IClientRepository") private _clientRepo:IClientRepository,
        @inject("ITurfRepository") private _turfRepo:ITurfRepository,
        @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt
    ){}
    async execute(token: string, password: string): Promise<boolean> {
        try {
            const verify = await this._tokenService.verifyAccessToken(token)
            if(!verify){
                throw new Error("Invaild token")
            }
            const tokenData = await this._tokenService.decodeAccessToken(token)
            if(!tokenData){
                throw new Error("token not found")
            }
            const role = tokenData.role;
            const data = await this._refreshTokenRepository.find(token)
            const isExpired = !!data?.expiresAt && new Date(data.expiresAt).getTime() < Date.now();
            if(!isExpired){
                const hashedPassword = await this.passwordBcrypt.hash(password)
                if(role=='user'){
                    await this._clientRepo.findByIdAndUpdatePassWord(data?.user as string,hashedPassword)
                    await this._refreshTokenRepository.revokeRefreshToken(token)
                    return true
                }else{
                    await this._turfRepo.findByIdAndUpdatePassWord(data?.user as string , hashedPassword)
                    await this._refreshTokenRepository.revokeRefreshToken(token)
                    return true
                }
            }else{
                throw new Error("token expired")
            }

        } catch (error) {
            return false
        }
    }
}