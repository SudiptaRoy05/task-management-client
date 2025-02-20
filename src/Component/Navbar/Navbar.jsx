import { useState, useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        const htmlElement = document.documentElement;
        if (darkMode) {
            htmlElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors duration-300">
            <div className="navbar w-10/12 mx-auto flex justify-between items-center py-4">
                <a className="font-bold text-xl">WorkFlow</a>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900"
                    >
                        {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                    </button>
                    <button className="font-medium">Login</button>
                </div>
            </div>
        </div>
    );
}
