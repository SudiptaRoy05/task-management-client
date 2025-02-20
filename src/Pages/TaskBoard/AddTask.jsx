import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AddTask() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        const task = {
            title: taskTitle,
            description: taskDescription,
            category: "todo",
        }

        try {
            const { data } = await axios.post("http://localhost:5000/tasks", task);
            console.log(data);

            // Show success notification
            Swal.fire({
                icon: 'success',
                title: 'Task Added!',
                text: 'Your task has been successfully added.',
                confirmButtonText: 'OK',
                timer: 2000,  // Auto close after 2 seconds
            });

            // Optionally, close the modal and reset form fields
            closeModal();
            setTaskTitle("");
            setTaskDescription("");
        } catch (err) {
            console.log(err);

            // Show error notification
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while adding the task.',
                confirmButtonText: 'Try Again',
            });
        }
    };

    return (
        <div className="w-10/12 mx-auto">
            <div className=" rounded-lg  mt-6 flex flex-col items-center justify-center p-6 dark:bg-gray-800 transition-colors duration-300">
                <button
                    onClick={openModal}
                    className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                    + Add New Task
                </button>

                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4 transition-colors duration-300"
                            >
                                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                                    Add Task
                                </h2>
                                <form onSubmit={handleAddTask} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Task Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Task Title"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Task Description
                                        </label>
                                        <textarea
                                            placeholder="Enter Task Description"
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
