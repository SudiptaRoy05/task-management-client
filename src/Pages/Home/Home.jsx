import { useContext } from "react";
import Navbar from "../../Component/Navbar/Navbar";
import AddTask from "../TaskBoard/AddTask";
import TaskBoards from "../TaskBoard/TaskBoards";
import { AuthContext } from "../../Provider/AuthProvider";
import Hero from "../Hero/Hero";

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <Navbar />
            {user ? (
                <>
                    <AddTask />
                    <TaskBoards />
                </>
            ):(<Hero></Hero>)}
        </div>
    );
}