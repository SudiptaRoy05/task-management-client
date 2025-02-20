import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";

export default function TaskCard({ task, onEdit, onDelete }) {
    const { title, description, timestamp, category, finishTime } = task;
    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
        const updateRemainingTime = () => {
            if (!finishTime) return;

            const now = new Date().getTime();
            const finishTimeMs = new Date(finishTime).getTime();
            const timeDiff = finishTimeMs - now;

            if (timeDiff <= 0) {
                setRemainingTime("Time's up!");
                return;
            }

            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateRemainingTime(); // Initial calculation
        const interval = setInterval(updateRemainingTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [finishTime]);

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md space-y-2 relative">
            {/* Title & Actions */}
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg truncate">
                    {title.length > 50 ? title.slice(0, 50) + "..." : title}
                </h3>

                {/* Edit & Delete Icons */}
                <div className="flex space-x-2">
                    <FaEdit
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={() => onEdit(task)}
                    />
                    <FaTrash
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => onDelete(task.id)}
                    />
                </div>
            </div>

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

            {/* Countdown Timer with Clock Icon */}
            {finishTime && (
                <div className="flex items-center text-xs font-medium text-red-500 dark:text-red-400 mt-2 space-x-1">
                    <FaClock className="text-sm" /> 
                    <span>{remainingTime}</span>
                </div>
            )}
        </div>
    );
}
