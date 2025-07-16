import { User } from "./Type";

export type AuthResponseUser = {
    message: string;
    user: User; 
    token?: string;
}