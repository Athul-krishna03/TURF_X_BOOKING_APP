import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { inject,injectable } from "tsyringe";
import { IWalletRepository } from "../../entities/repositoryInterface/wallet/IWalletRepository";
import { IWalletEntity } from "../../entities/models/wallet.entity";

@injectable()
export class WalletServices  implements IWalletSercvices {

    constructor(
        @inject("IWalletRepository") private _walletRepo: IWalletRepository
    ) {}

    async addFundsToWallet(userId: string, amount: number,data:object,userType:string): Promise<IWalletEntity> {
        const wallet = await this._walletRepo.findByUserId(userId,userType);
        if (!wallet) {
            const newWallet = await this._walletRepo.save({
                userId,
                userType,
                balance: amount,
                transaction:[data]
            });
            return newWallet as IWalletEntity;
        }else{
            const updatedWallet = await this._walletRepo.findByIdAndUpdate(wallet.id, {
                balance: wallet.balance + amount,
                transaction: [...wallet.transaction, data]
            });
            if (!updatedWallet) {
            throw new Error("Failed to update wallet balance");
            }
            return updatedWallet as IWalletEntity;
        }
    }
    async reduceFunds(userId: string, amount: number, data: object, userType: string): Promise<IWalletEntity> {
        const wallet = await this._walletRepo.findByUserId(userId,userType);
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const updatedWallet = await this._walletRepo.findByIdAndUpdate(wallet.id, {
            balance: wallet.balance - amount,
            transaction: [...wallet.transaction, data]
        });
        if (!updatedWallet) {
            throw new Error("Failed to update wallet balance");
        }
        return updatedWallet as IWalletEntity;
    }
}