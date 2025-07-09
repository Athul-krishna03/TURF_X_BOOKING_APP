import { ClientProfileResponse } from "../../../shared/responseTypes/clientProfileResponse";
import { IClientEntity } from "../../models/client.entity";

export interface IUpdateProfileUseCase{
    execute(clientId:string,data:Partial<IClientEntity>):Promise<ClientProfileResponse>
}