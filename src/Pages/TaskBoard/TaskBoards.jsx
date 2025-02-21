import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { useEffect } from "react";
import { io } from "socket.io-client";

// Set up the socket connection
const socket = io("http://localhost:5000");

export default function TaskBoards() {
    // Fetch tasks from the API using useQuery
    const { data: tasks = [], isLoading, error, refetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/tasks');
            return res.data;
        },
    });

    // Listen for real-time task updates
    useEffect(() => {
        socket.on("taskUpdated", refetch);
        socket.on("taskDeleted", refetch);

        return () => {
            socket.off("taskUpdated");
            socket.off("taskDeleted");
        };
    }, [refetch]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;

    // ✅ Fixed Drag and Drop Logic
    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return; // Dropped outside

        const sourceCategory = source.droppableId;
        const destinationCategory = destination.droppableId;

        // Get filtered tasks for the source category
        const sourceTasks = tasks.filter(task => task.category === sourceCategory);
        const movedTask = sourceTasks[source.index];

        if (!movedTask) return;

        try {
            await axios.put(`http://localhost:5000/tasks/${movedTask._id}`, {
                ...movedTask,
                category: destinationCategory,
            });

            socket.emit("taskUpdated");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-10/12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-6">
                    <TaskColumn title="To-Do" tasks={tasks} category="todo" />
                    <TaskColumn title="In Progress" tasks={tasks} category="inProgress" />
                    <TaskColumn title="Done" tasks={tasks} category="done" />
                </div>
            </div>
        </DragDropContext>
    );
}

// ✅ Fixed TaskColumn Component
function TaskColumn({ title, tasks, category }) {
    const filteredTasks = tasks.filter(task => task.category === category); // Get tasks for the category

    return (
        <Droppable droppableId={category}>
            {(provided) => (
                <div
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
                    {filteredTasks.map((task, index) => (
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
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
