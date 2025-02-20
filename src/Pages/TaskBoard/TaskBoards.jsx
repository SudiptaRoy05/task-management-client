import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TaskCard from "./TaskCard";

export default function TaskBoards() {
    // Use useQuery to fetch tasks from the API
    const { data, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/tasks');
            return res.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;

    return (
        <div className="w-10/12 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-6">
                {/* To-Do Board */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">To-Do</h2>
                    <div className="space-y-4">
                        {data.filter(task => task.category === "todo").map(task => <TaskCard key={task._id} task={task}></TaskCard>)}
                    </div>
                </div>

                {/* In Progress Board */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">In Progress</h2>
                    <div className="space-y-4">
                        {data.filter(task => task.category === "inProgress").map(task => (
                            <div key={task._id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Done Board */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Done</h2>
                    <div className="space-y-4">
                        {data.filter(task => task.category === "done").map(task => (
                            <div key={task._id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
