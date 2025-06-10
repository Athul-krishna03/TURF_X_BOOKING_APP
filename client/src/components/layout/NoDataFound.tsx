import type React from "react"
import { FileQuestion } from "lucide-react"

interface NoDataFoundProps {
    message?: string
    icon?: React.ReactNode
    className?: string
}

export function NoDataFound({ message = "No data found", icon, className = "" }: NoDataFoundProps) {
    return (
        <div className={`w-full py-12 flex flex-col items-center justify-center text-center ${className}`}>
        <div className="rounded-full bg-gray-100 p-4 mb-4">
            {icon || <FileQuestion className="h-10 w-10 text-gray-400" />}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
    )
}
