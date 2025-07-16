import { injectable,inject } from "tsyringe";
import { PagenateTurfs } from "../../entities/models/pageinated-turfs.entity";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { IGetAllTurfRequestsUseCase } from "../../entities/useCaseInterfaces/admin/IGetAllTurfRequestsUsecase";
import { mapTurfData } from "../../shared/utils/MappingTurfData";
import { FilterQuery } from "mongoose";
import { ITurfEntity } from "../../entities/models/turf.entity";

@injectable()
export class GetAllTurfRequestsUseCase implements IGetAllTurfRequestsUseCase{

    constructor(
        @inject("ITurfRepository")
        private _turfRepository:ITurfRepository
    ){}
    async execute(pageNumber: number, pageSize: number, searchTerm: string): Promise<PagenateTurfs> {
        let filter: Record<string, unknown>={status:{$ne:"approved"}};
        if(searchTerm){
            filter.$or=[
                {name:{$regex:searchTerm,$options:"i"}},
                {email:{$regex:searchTerm,$options:"i"}}
            ]
        }
        const validPageNumber = Math.max(1,pageNumber || 1);
        const vaildPageSize = Math.max(1,pageSize || 10);
        const skip = (validPageNumber-1)*vaildPageSize;
        const limit = vaildPageSize;

        const {turfs,total} = await this._turfRepository.find(filter,skip,limit);
        const result = mapTurfData(turfs);
        const response: PagenateTurfs = {
            turfs: result,
            total: Math.ceil(total / vaildPageSize)
        }
        return response
    }
}