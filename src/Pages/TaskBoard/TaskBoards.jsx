import { div } from "framer-motion/client";

export default function TaskBoards() {
    return (
       <div className="w-10/12 mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6  mt-6 pb-6">
            {/* To-Do Board */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">To-Do</h2>
                <div className="space-y-4">
                    {/* Example Task */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Task Title</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Task description goes here.</p>
                    </div>
                    {/* More Tasks Can Be Added */}
                </div>
            </div>

            {/* In Progress Board */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">In Progress</h2>
                <div className="space-y-4">
                    {/* Example Task */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Task Title</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Task description goes here.</p>
                    </div>
                    {/* More Tasks Can Be Added */}
                </div>
            </div>

            {/* Done Board */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Done</h2>
                <div className="space-y-4">
                    {/* Example Task */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Task Title</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Task description goes here.</p>
                    </div>
                    {/* More Tasks Can Be Added */}
                </div>
            </div>
        </div>
       </div>
    );
}
 