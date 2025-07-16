
type transactions = {
    amount: number;
    type: string;
    date?:string | number ;
    description?: string;
};

export interface IWalletEntity{
    id: string;
    userId: string;
    userType: string; 
    transaction:transactions[];
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}