import { TRole } from "../../../shared/constants";
import { IRefreshTokenEntity } from "../../models/refresh.token.entity";

export interface IRefreshTokenRepository{
    revokeRefreshToken(token: string): unknown;
    find(token: string): Promise<IRefreshTokenEntity | null>
    save(data:{
        token:string;
        userType:TRole,
        user:string;
        expiresAt:number;
    }):Promise<void>;
}