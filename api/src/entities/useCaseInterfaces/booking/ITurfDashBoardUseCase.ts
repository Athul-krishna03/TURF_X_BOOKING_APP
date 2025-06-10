export interface ITurfDashBoardUseCase{
    execute(turfId: string): Promise<object>
}