import { TurfDto } from "../../shared/utils/MappingTurfData";
import { ITurfEntity } from "./turf.entity";

export interface PagenateTurfs {
    turfs: TurfDto[] | [];
    total: number;
}