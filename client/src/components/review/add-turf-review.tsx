"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Star, Send } from "lucide-react"
import { cn } from "../../lib/utils"

interface AddTurfReviewProps {
    turfName: string
    onSubmit: (review: {
        rating: number
        comment: string
    }) => void
    onCancel: () => void
}

export default function AddTurfReview({ turfName, onSubmit, onCancel }: AddTurfReviewProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0 || !comment.trim()) {
        return
        }

        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        onSubmit({
            rating,
            comment: comment.trim(),
        })

        setRating(0)
        setComment("")
        setIsSubmitting(false)
    }

    const isFormValid = rating > 0  && comment.trim()

    return (
        <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-400" />
            <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                Review {turfName}
            </span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Overall Rating *</Label>
                <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    >
                    <Star
                        className={cn(
                        "w-8 h-8 transition-colors",
                        hoveredRating >= star || rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600 hover:text-yellow-300",
                        )}
                    />
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                    {rating > 0 && (
                    <>
                        {rating} star{rating !== 1 ? "s" : ""}
                        {rating === 1 && " - Poor"}
                        {rating === 2 && " - Fair"}
                        {rating === 3 && " - Good"}
                        {rating === 4 && " - Very Good"}
                        {rating === 5 && " - Excellent"}
                    </>
                    )}
                </span>
                </div>
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-medium text-gray-300">
                Your Review *
                </Label>
                <Textarea
                id="comment"
                placeholder="Share your experience about the turf quality, facilities, staff, and overall experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 resize-none"
                />
                <div className="text-xs text-gray-500 text-right">{comment.length}/500</div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                Cancel
                </Button>
                <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 min-w-32"
                >
                {isSubmitting ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                    </>
                ) : (
                    <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                    </>
                )}
                </Button>
            </div>
            </form>
        </CardContent>
        </Card>
    )
}
