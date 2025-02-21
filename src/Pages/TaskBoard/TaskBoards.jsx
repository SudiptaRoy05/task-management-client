import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthProvider";
import TaskCard from "./TaskCard";
import { io } from "socket.io-client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const socket = io("http://localhost:5000");

export default function TaskBoards() {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [tasks, setTasks] = useState([]);

    // Fetch tasks with polling
    const { data: fetchedTasks = [], isLoading, error } = useQuery({
        queryKey: ["tasks", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axios.get(`http://localhost:5000/tasks?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 5000, 
    });

    
    useEffect(() => {
        setTasks(fetchedTasks);
    }, [fetchedTasks]);

    
    useEffect(() => {
        socket.on("TASK_UPDATED", (updatedTask) => {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
        });

        socket.on("TASK_DELETED", ({ id }) => {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        });

        return () => {
            socket.off("TASK_UPDATED");
            socket.off("TASK_DELETED");
        };
    }, []);

    
    const deleteTask = async (taskId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            if (response.status === 200) {
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                socket.emit("TASK_DELETED", { id: taskId });
            }
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    // Edit a task
    const editTask = async (taskId, updatedTask) => {
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, ...updatedTask } : task
                    )
                );
                socket.emit("TASK_UPDATED", response.data);
            }
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    // Handle drag-and-drop
    const handleOnDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const movedTask = tasks.find((task) => task._id === draggableId);
        editTask(movedTask._id, { category: destination.droppableId });

        setTasks((prevTasks) => {
            const newTasks = [...prevTasks];
            const sourceIndex = newTasks.findIndex((task) => task._id === draggableId);
            const [removedTask] = newTasks.splice(sourceIndex, 1);
            removedTask.category = destination.droppableId;
            newTasks.splice(destination.index, 0, removedTask);
            return newTasks;
        });
    };

    if (isLoading) return <p>Loading tasks...</p>;
    if (error) return <p>Error fetching tasks</p>;

    // Categorize tasks
    const categories = tasks.reduce(
        (acc, task) => {
            if (acc[task.category]) {
                acc[task.category].push(task);
            }
            return acc;
        },
        { todo: [], inProgress: [], done: [] }
    );

    return (
        <div className="w-10/12 mx-auto">
            <h2 className="text-xl font-bold mb-4">My Tasks</h2>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(categories).map(([category, tasks]) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`border p-2 rounded ${snapshot.isDraggingOver ? "dragging-over" : "droppable-area"}`}
                                >
                                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                    {tasks.length === 0 ? (
                                        <p>No tasks found</p>
                                    ) : (
                                        tasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-2"
                                                    >
                                                        <TaskCard
                                                            task={task}
                                                            onDelete={() => deleteTask(task._id)}
                                                            onEdit={(updatedTask) => editTask(task._id, updatedTask)}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}