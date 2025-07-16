import { IUserEntity } from "../../entities/models/user.entity";

export interface IUserBasicInfo {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    isBlocked?: boolean;
}

export function mapToBasicUserInfo(users: IUserEntity[]): IUserBasicInfo[] {
    return users.map(({ id, name, email, phone, isBlocked }) => ({
        _id: id,
        name,
        email,
        phone,
        isBlocked: typeof isBlocked === "boolean" ? isBlocked : undefined,
    }));
}
