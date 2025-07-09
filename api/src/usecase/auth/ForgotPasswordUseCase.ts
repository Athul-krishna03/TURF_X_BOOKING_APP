import { inject, injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IForgotPasswordUseCase";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { ITokenService } from "../../entities/services/ITokenServices";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/IRefreshToken_RepositoryInterface";
import { TRole } from "../../shared/constants";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { config } from "../../shared/config";


@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        @inject("IClientRepository") private _clientRepo:IClientRepository,
        @inject("ITurfRepository") private _turfRepo:ITurfRepository,
        @inject('ITokenService') private tokenService:ITokenService,
        @inject("IRefreshTokenRepository") private refreshTokenRepository:IRefreshTokenRepository,
        @inject("INodemailerService") private _nodeMailerService:INodemailerService
    ){}
    async execute(email: string, role: string): Promise<boolean> {
        try {
            if(role == "user"){
                const data = await this._clientRepo.findByEmail(email)
                if (!data || !data.id) {
                    throw new Error("User not found or missing id");
                }
                const payload = { id: data.id, email, role };
                const token = this.tokenService.generateAccessToken(payload);
                await this.refreshTokenRepository.save({
                    token:token,
                    userType:role as TRole,
                    user:data.id,
                    expiresAt:Date.now() + 15 * 60 * 1000
                })
                const  link = `${config.cors.ALLOWED_ORGIN}/reset-password?token=${token}`
                const content = `click the link to reset your password ${link}` 
                await this._nodeMailerService.sendEmail(email,"Password Reset Link",content)
                return true
            }else{
                const data = await this._turfRepo.findByEmail(email)
                if (!data || !data.id) {
                    throw new Error("User not found or missing id");
                }
                const payload = { id: data.id, email, role };
                const token = this.tokenService.generateAccessToken(payload);
                await this.refreshTokenRepository.save({
                    token:token,
                    userType:role as TRole,
                    user:data.id,
                    expiresAt:Date.now() + 15 * 60 * 1000
                })
                const  link = `${config.cors.ALLOWED_ORGIN}/reset-password?token=${token}`
                await this._nodeMailerService.sendRestEmail(email,"Password Reset Link",link)
                return true
            }
        } catch (error) {
            console.log(error)
            return false      
        }
    }
}