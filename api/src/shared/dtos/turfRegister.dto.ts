import { UserDTO } from "./user.dto";

export interface TurfRegisterDTO extends UserDTO {
    courtSize: string;
    turfPhotos:string[];
    aminities: string[];
    games:string[];
    location: {
        address: string;
        city: string;
        state: string;
        coordinates: {
            type:"Point",
            coordinates:[number,number]
        };
    };
}