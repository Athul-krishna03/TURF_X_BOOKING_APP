import { injectable } from "tsyringe";
import { ITurfRepository } from "../../../entities/repositoryInterface/turf/ITurfRepository";
import { ITurfEntity } from "../../../entities/models/turf.entity";
import { ITurfModel, TurfModel } from "../../../frameworks/database/models/turf.model";
import { TurfProfileResponse } from "../../../shared/responseTypes/turfProfileResponse";
import { BaseRepository } from "../base.repository";
import { PipelineStage } from "mongoose";


@injectable()
export class TurfRepository extends BaseRepository<ITurfModel> implements  ITurfRepository{
    constructor(){
        super(TurfModel)
    }
    async getTurfByTurfId(turfId: string): Promise<ITurfEntity | null> {
        return await TurfModel.findOne({ turfId });
    }
    async findByEmail(email: string): Promise<ITurfEntity | null> {
        const client = await TurfModel.findOne({email}).lean();
        console.log("turf client inside findby email",client)
        if(!client) return null;

        return{
            ...client,
            role:"turf",
            id:client._id.toString()
        } as ITurfEntity
    }

    async find(filter: any, skip: number, limit: number,location?:[number,number]): Promise<{ turfs: ITurfEntity[] | []; total: number; }> {
        
        if (location && location.length === 2) {
            console.log("cooredinates",location)
            const [lng, lat] = location;

            const pipeline: PipelineStage[] = [
                {
                    $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    distanceField: "distance",
                    spherical: true,
                    query: filter,
                    maxDistance: 15000,
                    },
                },
                {
                    $facet: {
                    turfs: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                    },
                },
                ];

        const [result] = await TurfModel.aggregate(pipeline);
        const turfs = result?.turfs ?? [];
        const total = result?.totalCount?.[0]?.count ?? 0;

        return { turfs, total };

        }

        const turfs = await TurfModel.find(filter).skip(skip).limit(limit).lean();
        const total = await TurfModel.countDocuments(filter);
        return { turfs, total };
    }

    async findByIdAndUpdateStatus(id: string): Promise<void> {
        console.log("id turf",id);
        const user = await TurfModel.findById({_id:id});
        console.log("user status",user);
        if(!user){
            throw new Error("User not found");
        }
        
        const updateStatus = !user.isBlocked;
        const result = await TurfModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:updateStatus}})
    }

    async findByIdAndUpdateRequest(id: string,status:string): Promise<void> {
        const user = await TurfModel.findById({_id:id});
        console.log("update status in repo",status)
        console.log("user status",user);
        if(!user){
            throw new Error("User not found");
        }
        const result = await TurfModel.findByIdAndUpdate({_id:id},{$set:{status:status}})
    }

    async findById(id: string): Promise<ITurfEntity | null> {
        const client = await TurfModel.findById({_id:id}).lean();
        console.log("turf client inside findby email",client)
        if(!client) return null;
        return{
            ...client,
            role:"turf",
            id:client._id.toString()
        } as ITurfEntity
    }

    async updateProfileById(id: string, data: Partial<ITurfEntity>): Promise<TurfProfileResponse> {
            const updateProfile = await TurfModel.findByIdAndUpdate(
                id,
                {$set:data},
                {
                    new:true
                }
            ).select('name phone  email location aminities turfPhotos courtSize')
            .exec()
            console.log("data from repo layer of turf profile",updateProfile);
            
            if(!updateProfile){
                throw new Error("Profile not found");
            }
    
            return updateProfile as unknown as TurfProfileResponse
        }

        async findByIdAndUpdatePassWord(id: string, password: string): Promise<void> {
                const updatePass = await TurfModel.findByIdAndUpdate({_id:id},{$set:{password:password}},{new:true});
        
                if(!updatePass){
                    throw new Error("Profile not found to update pass")
                }
        
                return 
            }
}