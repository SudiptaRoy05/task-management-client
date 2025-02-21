import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";
import Swal from "sweetalert2";

export default function TaskCard({ task, onEdit, onDelete }) {
    console.log(task)
    const { _id, title, description, timestamp, category, finishTime } = task;
    const [remainingTime, setRemainingTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedTask, setUpdatedTask] = useState({ title, description, category, finishTime });

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

        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [finishTime]);

    const openModal = () => {
        setUpdatedTask({ title, description, finishTime });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = async (_id) => {
        try {
            console.log(_id)
            await axios.patch(`http://localhost:5000/tasks/${_id}`, updatedTask);


            // Show success alert
            Swal.fire({
                title: "Success!",
                text: "Task updated successfully.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });

            onEdit(); // Refetch tasks after update
            closeModal();
        } catch (error) {
            console.error("Error updating task:", error);

            // Show error alert
            Swal.fire({
                title: "Error!",
                text: "Failed to update task. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        }
    };

    const handleDelete = async () => {
        try {
            // Optimistically remove the task from UI first
            onDelete(_id);
    
            await axios.delete(`http://localhost:5000/tasks/${_id}`);
    
            // Show success alert
            Swal.fire({
                title: "Success!",
                text: "Task deleted successfully.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
    
            // Delay refetch slightly to avoid UI flickering or drag issues
            setTimeout(() => onDelete(), 500);
        } catch (error) {
            console.error("Error deleting task:", error);
    
            // Show error alert
            Swal.fire({
                title: "Error!",
                text: "Failed to delete task. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        }
    };
    


    return (
        <>
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
                            onClick={openModal}
                        />
                        <FaTrash
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={handleDelete}
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

            {/* Update Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Update Task</h2>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Title</label>
                        <input
                            type="text"
                            value={updatedTask.title}
                            onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Description</label>
                        <textarea
                            value={updatedTask.description}
                            onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />


                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Finish Time</label>
                        <input
                            type="datetime-local"
                            value={updatedTask.finishTime}
                            onChange={(e) => setUpdatedTask({ ...updatedTask, finishTime: e.target.value })}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-md"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md btn"
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
