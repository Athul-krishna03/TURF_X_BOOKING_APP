export interface IForgotPasswordUseCase{
    execute(email: string, role: string): Promise<boolean>
}