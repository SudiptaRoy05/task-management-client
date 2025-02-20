import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import socket.io-client

// Set up the socket connection
const socket = io("http://localhost:5000");

export default function TaskBoards() {
    // Fetch tasks from the API using useQuery
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/tasks');
            return res.data;
        },
    });

    const [tasks, setTasks] = useState(data || []); // Local state for tasks

    // Listen for task updates through socket
    useEffect(() => {
        socket.on("taskUpdated", (updatedTask) => {
            setTasks((prevTasks) => {
                return prevTasks.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                );
            });
        });

        // Clean up socket connection when component unmounts
        return () => socket.off("taskUpdated");
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;

    // Handle drag and drop logic
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }

        // If the task was moved to a different category, update the task category in the database
        if (destination.droppableId !== source.droppableId) {
            const movedTask = tasks[source.index];
            movedTask.category = destination.droppableId;

            // Call your API to update the task category in the backend
            axios.put(`http://localhost:5000/tasks/${movedTask._id}`, movedTask)
                .then((res) => {
                    // Emit the updated task to other connected clients
                    socket.emit("taskUpdated", movedTask);
                })
                .catch((err) => console.error("Error updating task:", err));
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-10/12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-6">
                    {/* To-Do Board */}
                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">To-Do</h2>
                                <div className="space-y-4">
                                    {tasks.filter(task => task.category === "todo").map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TaskCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* In Progress Board */}
                    <Droppable droppableId="inProgress">
                        {(provided) => (
                            <div
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">In Progress</h2>
                                <div className="space-y-4">
                                    {tasks.filter(task => task.category === "inProgress").map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TaskCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Done Board */}
                    <Droppable droppableId="done">
                        {(provided) => (
                            <div
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Done</h2>
                                <div className="space-y-4">
                                    {tasks.filter(task => task.category === "done").map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TaskCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
}
