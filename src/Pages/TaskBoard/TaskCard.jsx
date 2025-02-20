export default function TaskCard({ task }) {
    const { title, description, timestamp, category } = task;

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg truncate">
                {title.length > 50 ? title.slice(0, 50) + "..." : title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {description.length > 200 ? description.slice(0, 200) + "..." : description}
                </p>
            )}

            {/* Timestamp & Category */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(timestamp).toLocaleString()}</span>
                <span className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs capitalize">
                    {category}
                </span>
            </div>
        </div>
    );
}
