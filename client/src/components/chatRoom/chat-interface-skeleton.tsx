export function ChatInterfaceSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-32"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`flex animate-pulse ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xs lg:max-w-md p-4 rounded-lg ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`}>
              <div className="space-y-2">
                <div className="h-3 bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                <div className="h-2 bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 animate-pulse">
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-700 rounded"></div>
          <div className="w-10 h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}
