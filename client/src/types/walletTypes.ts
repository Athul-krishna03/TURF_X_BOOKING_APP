export interface IwalletType{
    id: string;
    userId: string;
    userType: string; 
    transaction:any[];
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}