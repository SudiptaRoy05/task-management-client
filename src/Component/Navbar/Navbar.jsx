import { useState, useEffect, useContext } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";

export default function Navbar() {
    const { user, googleLogin, logout } = useContext(AuthContext);
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

    // Handle Google Login
    const handleSocialLogin = () => {
        googleLogin()
            .then((result) => {
                const userInfo = {
                    name: result.user?.displayName,
                    email: result.user?.email,
                    image: result.user?.photoURL,
                };
                axios.post("http://localhost:5000/user", userInfo);
            })
            .catch((error) => console.error("Google login failed:", error));
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="bg-gray-900 dark:bg-gray-800">
            <div className="navbar w-10/12 mx-auto flex justify-between items-center py-4">
                <a className="text-white font-bold text-xl">WorkFlow</a>
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full bg-gray-700 dark:bg-gray-600 text-white"
                    >
                        {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                    </button>

                    {/* User Section */}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-white hidden md:block">{user.displayName}</span>
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="user"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleSocialLogin}
                            className="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-2"
                        >
                            <FaGoogle className="text-red-500 text-sm" />
                            <span className="hidden md:inline text-sm">Sign in</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
