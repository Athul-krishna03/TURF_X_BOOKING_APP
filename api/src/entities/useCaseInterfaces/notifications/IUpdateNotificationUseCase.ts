export interface IUpdateNotificationUseCase{
    execute(userId:string,id?:string,all?:string):Promise<void>;
}