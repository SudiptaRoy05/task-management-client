import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";

export default function TaskCard({ task, onEdit, onDelete }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { _id, title, description, timestamp, finishTime, category } = task;
    const [remainingTime, setRemainingTime] = useState("");
    const [updatedTask, setUpdatedTask] = useState({
        title: task.title,
        description: task.description,
        finishTime: task.finishTime,
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        onEdit(updatedTask);
        closeModal();
    };

    useEffect(() => {
        if (!finishTime) {
            setRemainingTime("No deadline set");
            return;
        }

        const updateCountdown = () => {
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

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [finishTime]);

    return (
        <>
            {/* Task Card */}
            <div className="bg-white dark:bg-gray-800 p-5 my-3 rounded-lg shadow-lg space-y-3 relative border-l-4 border-blue-500">
                {/* Title & Actions */}
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg truncate">{title}</h3>
                    <div className="flex space-x-3">
                        <FaEdit
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            onClick={openModal}
                            aria-label="Edit Task"
                        />
                        <FaTrash
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => onDelete(_id)}
                            aria-label="Delete Task"
                        />
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{description}</p>

                {/* Timestamp & Category */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(timestamp).toLocaleString()}</span>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs capitalize">{category}</span>
                </div>

                {/* Countdown Timer */}
                {finishTime && (
                    <div className="flex items-center text-xs font-medium text-red-500 dark:text-red-400 mt-2 space-x-2">
                        <FaClock className="text-sm" />
                        <span>{remainingTime}</span>
                    </div>
                )}
            </div>

            {/* Update Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Update Task</h2>

                        {/* Title */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={updatedTask.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white mt-1"
                        />

                        {/* Description */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Description</label>
                        <textarea
                            name="description"
                            value={updatedTask.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white mt-1"
                        />

                        {/* Finish Time */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Finish Time</label>
                        <input
                            type="datetime-local"
                            name="finishTime"
                            value={updatedTask.finishTime}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white mt-1"
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-5 space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}