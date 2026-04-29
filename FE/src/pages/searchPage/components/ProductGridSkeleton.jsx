export default function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse border rounded-xl overflow-hidden bg-white">
                    <div className="w-full aspect-[3/4] bg-gray-200" />
                    <div className="p-3">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
