import axios from "axios";
import { INewsApiService } from "../../entities/services/INewsApiService";

export class NewsApiService implements INewsApiService{
    async execute():Promise<object[]>{
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
            q: "football",
            sortBy: "publishedAt",
            language: "en",
            apiKey:process.env.NEWS_API_KEY,
            },
        });
        return response.data.articles
    }
}