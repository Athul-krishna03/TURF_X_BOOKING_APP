import { inject, injectable } from "tsyringe";
import { ISlotEntity } from "../../entities/models/slot.entity";
import { IGetSlotDataUseCase } from "../../entities/useCaseInterfaces/slot/IGetSlotDataUseCase";
import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";

@injectable()
export class GetSlotDataUseCase implements IGetSlotDataUseCase{
    constructor(
        @inject("ISlotRepository") private slotRepo:ISlotRepository
    ){}
    async execute(slotId:string):Promise<ISlotEntity> {
        const data = await this.slotRepo.findById(slotId); 
        return data
    }
}