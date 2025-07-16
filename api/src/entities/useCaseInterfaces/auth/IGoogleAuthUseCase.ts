import { TRole } from "../../../shared/constants";
import { IClientEntity } from "../../models/client.entity";

export interface IGoogleAuthUseCase {
    execute(
        credentials:string,
        client_id:string,
        role:TRole
    ):Promise<Partial<IClientEntity>>
}