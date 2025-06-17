import { IGetCommunityNewUseCase } from "../../entities/useCaseInterfaces/user/IGetCommunityNewUseCase";
import axios from "axios";
import { injectable } from "tsyringe";

export interface ArticleDTO{
    title:string
    urlToImage:string
    source:any
    url:string
}

@injectable()
export class GetCommunityNewUseCase implements IGetCommunityNewUseCase {
    async execute():Promise<ArticleDTO[]> {
        try {
            const response = await axios.get("https://newsapi.org/v2/everything", {
                params: {
                    q: "football", 
                    sortBy: "publishedAt",
                    language: "en",
                    apiKey: "048bfaae222c42c2aafd76aed8682b0e"
                }
            });

            const articles = response.data.articles;

            const news = articles.map((article: any) => {
                return {
                    title: article.title,
                    urlToImage: article.urlToImage,
                    source: article.source,
                    url: article.url
                } as ArticleDTO;
            });
            return news;

        } catch (error:any) {
            console.error("Failed to fetch sports news:", error.message);
            return [];
        }
    }
}
