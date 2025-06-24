"use client"

import {  useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Star, MessageSquare } from "lucide-react"
import AddTurfReview from "./add-turf-review"
import {  useReviews } from "../../hooks/review/useGetReviews"
import { useSelector } from "react-redux"

interface Review {
  id: string
  reviewId?:string
  rating: number
  comment: string
  clientAvatar?:string;
  clientName?:string;
  date: string
  createdAt?: Date;
}

interface TurfReviewsProps {
  turfId: string
  turfName: string
}

export interface IReviewEntity {
	reviewId?: string;
	reviewerId: string;
	turfId: string;
    clientAvatar:string;
    clientName:string;
    comment:string
	rating: number;
	createdAt: Date;
}
export default function TurfReviews({ turfId, turfName }: TurfReviewsProps) {

   const { data: reviews = [], addReview } = useReviews(turfId)
   const user = useSelector((state:any)=>state.user.user)

    const [showAddReview, setShowAddReview] = useState(false)

   const handleAddReview = async (newReview: Omit<Review, "id" | "date">) => {
    try {
        await addReview({
        turfId,
        rating: newReview.rating.toString(),
        reviewText: newReview.comment,
        });
        setShowAddReview(false); // Hide the form after successful submission
    } catch (error) {
        console.error("Error submitting review:", error);
    }
    };

    const averageRating =
        reviews.length > 0 ? reviews.reduce((sum:number, review:Review) => sum + review.rating, 0) / reviews.length : 0

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((r:Review) => r.rating === rating).length,
        percentage: reviews.length > 0 ? (reviews.filter((r:Review) => r.rating === rating).length / reviews.length) * 100 : 0,
    }))


    const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
        const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"
        return Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${starSize} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
        ))
    }

    return (
        <div className="space-y-6">
        {/* Reviews Header */}
        <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center">
                <MessageSquare className="mr-2 text-green-400" />
                <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                    Reviews & Ratings
                </span>
                </CardTitle>
                {!reviews.some((val:IReviewEntity)=>val.clientName == user.name) &&
                <Button
                onClick={() => setShowAddReview(!showAddReview)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                >
                {showAddReview ? "Cancel" : "Write Review"}
                </Button>
                } 
            </div>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="space-y-4">
                <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mb-2">
                    {renderStars(Math.round(averageRating), "md")}
                    </div>
                    <p className="text-gray-400 text-sm">Based on {reviews.length} reviews</p>
                </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-400 w-8">{count}</span>
                    </div>
                ))}
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Add Review Form */}
        {showAddReview && (
            <AddTurfReview turfName={turfName} onSubmit={handleAddReview} onCancel={() => setShowAddReview(false)} />
        )}

        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Customer Reviews</h3>
        </div>
        <div className="space-y-4">
            {reviews.map((review:Review) => (
            <Card key={review.reviewId} className="bg-gray-900/60 border-gray-800">
                <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={review.clientAvatar|| "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-700 text-white">
                        {(review?.clientName ?? "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{review.clientName}</span>
                        <span className="text-sm text-gray-400">{new Date(review?.createdAt ?? "").toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-400">({review.rating}/5)</span>
                    </div>[]

                    <div>
                        
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    )
}
