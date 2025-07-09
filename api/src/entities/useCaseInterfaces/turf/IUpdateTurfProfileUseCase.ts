
import { TurfProfileResponse } from "../../../shared/responseTypes/turfProfileResponse";
import { ITurfEntity } from "../../models/turf.entity";

export interface IUpdateTurfProfileUseCase{
    execute(turfId:string,data:Partial<ITurfEntity>):Promise<TurfProfileResponse>
}