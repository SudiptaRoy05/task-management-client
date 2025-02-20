
import Navbar from "../../Component/Navbar/Navbar";
import AddTask from "../TaskBoard/AddTask";
import TaskBoards from "../TaskBoard/TaskBoards";

export default function Home() {
  return (
    <div >
      <Navbar></Navbar>
      <AddTask></AddTask>
      <TaskBoards></TaskBoards>
    </div>
  )
}
