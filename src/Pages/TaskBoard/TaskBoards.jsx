import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function TaskBoards() {
    const { data: tasks = [], isLoading, error, refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5000/tasks");
            return res.data;
        },
    });

    // Local state to manage drag-and-drop changes before API update
    const [localTasks, setLocalTasks] = useState([]);

    // Sync local state when `tasks` updates
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    useEffect(() => {
        socket.on("taskUpdated", () => refetch());
        socket.on("taskDeleted", () => refetch());

        return () => {
            socket.off("taskUpdated");
            socket.off("taskDeleted");
        };
    }, [refetch]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;

    // 🏆 **Fixed Drag and Drop Handling**
    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Find the moved task
        const sourceTasks = localTasks.filter(task => task.category === source.droppableId);
        const movedTask = sourceTasks[source.index];

        if (!movedTask) return;

        // **Update local state optimistically**
        const updatedTasks = localTasks.map((task) =>
            task._id === movedTask._id ? { ...task, category: destination.droppableId } : task
        );

        setLocalTasks(updatedTasks);

        // **Update task category in the backend**
        try {
            await axios.put(`http://localhost:5000/tasks/${movedTask._id}`, {
                ...movedTask,
                category: destination.droppableId,
            });

            socket.emit("taskUpdated");
        } catch (error) {
            console.error("Error updating task:", error);
            setLocalTasks(tasks); // Rollback on error
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-10/12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-6">
                    <TaskColumn title="To-Do" tasks={localTasks} category="todo" onEdit={refetch} onDelete={refetch} />
                    <TaskColumn title="In Progress" tasks={localTasks} category="inProgress" onEdit={refetch} onDelete={refetch} />
                    <TaskColumn title="Done" tasks={localTasks} category="done" onEdit={refetch} onDelete={refetch} />
                </div>
            </div>
        </DragDropContext>
    );
}

// TaskColumn Component for Reusability
function TaskColumn({ title, tasks, category, onEdit, onDelete }) {
    return (
        <Droppable droppableId={category}>
            {(provided) => (
                <div
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
                    <div className="space-y-4">
                        {tasks
                            .filter(task => task.category === category)
                            .map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                    </div>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
