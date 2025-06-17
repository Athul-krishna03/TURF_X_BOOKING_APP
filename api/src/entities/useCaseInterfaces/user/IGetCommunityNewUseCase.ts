import { ArticleDTO } from "../../../usecase/user/GetCommunityNewsUseCase";

export interface IGetCommunityNewUseCase{
    execute():Promise<ArticleDTO[]>
}