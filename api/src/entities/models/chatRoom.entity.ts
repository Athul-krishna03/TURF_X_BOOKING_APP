export interface IChatRoomEntity{
    id?:string,
    gameId:string,
    users:string[],
    hostId:string,
    name:string,
    status:string,
    imageUrl?:string,
    createAt:Date,
    updatedAt:Date
}