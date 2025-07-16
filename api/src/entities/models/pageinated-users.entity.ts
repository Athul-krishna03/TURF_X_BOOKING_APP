import { IUserBasicInfo } from "../../shared/utils/MappingUsersData";

export interface PagenateCustomers {
  users: IUserBasicInfo[] | [];
  total: number;
}
