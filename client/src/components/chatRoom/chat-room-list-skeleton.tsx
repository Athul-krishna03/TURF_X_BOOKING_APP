export function ChatRoomsListSkeleton() {
  return (
    <div className="divide-y divide-gray-700">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-12"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
