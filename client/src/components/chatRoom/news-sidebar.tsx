"use client";

import { useEffect } from "react";
import { ExternalLink, Clock, Globe } from "lucide-react";


interface NewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    title: string;
    url: string;
    urlToImage: string | null;
    publishedAt?: string;
    description?: string;
}

interface NewsSidebarProps {
    className?: string;
    news:NewsArticle[];
    isLoading:boolean;
    fetchNews:()=>{}
}

export interface ArticleDTO {
    title: string;
    urlToImage: string;
    source: any;
    url: string;
}

export function NewsSidebar({ className = "" ,news,isLoading,fetchNews}: NewsSidebarProps) {
    
    useEffect(() => {
        fetchNews();
    }, []);
    const handleNewsClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        );

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    if (isLoading) {
        return (
        <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
            <div className="p-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Latest News
            </h2>
            </div>
            <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                <div className="bg-gray-700 h-32 rounded-lg mb-3"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                </div>
            ))}
            </div>
        </div>
        );
    }

    return (
        <div
        className={`bg-gray-800 border-l border-gray-700 flex flex-col ${className}`}
        >
        <div className="p-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Latest News
            </h2>
            <button
                onClick={fetchNews}
                className="text-gray-400 hover:text-white transition-colors"
                title="Refresh news"
            >
                <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
                </svg>
            </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {!news && (
            <div className="p-4 text-center text-red-400">
                <p>No news</p>
                <button
                onClick={fetchNews}
                className="mt-2 text-blue-400 hover:text-blue-300 underline"
                >
                Try again
                </button>
            </div>
            )}

            <div className="p-4 space-y-4">
            {news.map((article, index) => (
                <div
                key={index}
                onClick={() => handleNewsClick(article.url)}
                className="group cursor-pointer bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-all duration-200 hover:shadow-lg"
                >
                {article.urlToImage && (
                    <div className="relative mb-3 overflow-hidden rounded-md">
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/300x128?text=No+Image";
                        }}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <h3 className="text-white font-medium text-sm leading-tight group-hover:text-blue-300 transition-colors line-clamp-3">
                    {article.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span className="truncate max-w-24">
                        {article.source.name}
                        </span>
                    </div>

                    {article.publishedAt && (
                        <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                    )}
                    </div>

                    <div className="flex items-center justify-end">
                    <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                </div>
                </div>
            ))}
            </div>

            {news.length === 0 && !isLoading  && (
            <div className="p-4 text-center text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No news available</p>
            </div>
            )}
        </div>
        </div>
    );
}
