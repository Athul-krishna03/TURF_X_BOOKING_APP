export interface IAdminDashBoardUseCase{
    execute(adminId:string): Promise<object>
}