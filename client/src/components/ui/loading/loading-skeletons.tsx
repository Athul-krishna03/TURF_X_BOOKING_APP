"use client"

import { Card, CardContent, CardHeader } from "../card"
import { Skeleton } from "../skeleton"

// Dashboard Loading Skeleton
export function DashboardLoadingSkeleton() {
    return (
        <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Charts and Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Skeleton */}
            <Card className="animate-pulse">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="animate-pulse">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    )
}

export function TableLoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-4">
        {/* Table Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>

        {/* Table Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-8 w-full" />
            ))}
            </div>
        ))}
        </div>
    )
}

// Card Loading Skeleton
export function CardLoadingSkeleton({
    showImage = false,
    showActions = false,
    }: {
    showImage?: boolean
    showActions?: boolean
    }) {
    return (
        <Card className="animate-pulse">
        <CardHeader>
            <div className="flex items-center space-x-4">
            {showImage && <Skeleton className="h-12 w-12 rounded-full" />}
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            </div>
            {showActions && (
            <div className="flex space-x-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
            )}
        </CardContent>
        </Card>
    )
}

// Form Loading Skeleton
export function FormLoadingSkeleton({ fields = 6 }: { fields?: number }) {
    return (
        <div className="space-y-6">
        {[...Array(fields)].map((_, i) => (
            <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            </div>
        ))}
        <Skeleton className="h-10 w-32" />
        </div>
    )
}

// List Loading Skeleton
export function ListLoadingSkeleton({
    items = 5,
    showAvatar = true,
    showActions = false,
    }: {
    items?: number
    showAvatar?: boolean
    showActions?: boolean
    }) {
    return (
        <div className="space-y-4">
        {[...Array(items)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
            {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            {showActions && (
                <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                </div>
            )}
            </div>
        ))}
        </div>
    )
}
