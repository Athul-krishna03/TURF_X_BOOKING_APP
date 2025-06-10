
export interface ISaveFCMTokenUseCase {
    execute(userId:string,token:string):Promise<void>
}