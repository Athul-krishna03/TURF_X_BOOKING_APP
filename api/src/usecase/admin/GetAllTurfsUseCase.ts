import { injectable,inject } from "tsyringe";
import { IGetAllTurfUseCase } from "../../entities/useCaseInterfaces/admin/IGetAllTurfsUseCase";
import { PagenateTurfs } from "../../entities/models/pageinated-turfs.entity";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { IReviewRepository } from "../../entities/repositoryInterface/review/review-reposistory.interface";

@injectable()
export class GetAllTurfsUseCase implements IGetAllTurfUseCase{

    constructor(
        @inject("ITurfRepository")private turfRepository:ITurfRepository,
        @inject("IReviewRepository") private _reviewRepo:IReviewRepository
    ){}
    async execute(pageNumber: number, pageSize: number, searchTerm: string,location?: [number, number]): Promise<PagenateTurfs> {
        let filter:any= {status:"approved"};
        if(searchTerm){
            filter.$or=[
                {name:{$regex:searchTerm,$options:"i"}},
                {"location.city":{$regex:searchTerm,$options:"i"}}
            ]
        }
    
        const validPageNumber = Math.max(1,pageNumber || 1);
        const vaildPageSize = Math.max(1,pageSize || 10);
        const skip = (validPageNumber-1)*vaildPageSize;
        const limit = vaildPageSize;

        const {turfs,total} = await this.turfRepository.find(filter,skip,limit,location);
        const enrichedTurfs = await Promise.all(
            turfs.map(async (turf) => {
                const reviewData = await this._reviewRepo.getReviewStatsByTurfId({ turfId: turf.turfId });
                return {
                    ...turf,
                    reviewStats: reviewData 
                };
            })
        );

        const response: PagenateTurfs = {
            turfs: enrichedTurfs,
            total: Math.ceil(total / vaildPageSize)
        };
            return response
    }
}