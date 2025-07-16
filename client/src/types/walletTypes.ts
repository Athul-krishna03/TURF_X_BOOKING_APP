type transactions = {
    amount: number;
    type: string;
    date?:string | number ;
    description?: string;
};
export interface IwalletType{
    id: string;
    userId: string;
    userType: string; 
    transaction:transactions[];
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}