export interface IResetPasswordUseCase{
    execute(token: string, password: string): Promise<boolean>
}