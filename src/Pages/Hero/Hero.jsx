export default function Hero() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white transition-colors duration-300">
            <div className="text-center max-w-4xl px-4">
                {/* Heading with Animation */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                    Organize Your Life with{" "}
                    <span className="text-white dark:text-blue-400">Task Manager</span>
                </h1>

                {/* Description with Animation */}
                <p className="text-lg md:text-xl text-gray-100 dark:text-gray-300 mb-8 animate-fade-in-up delay-100">
                    Task Manager is your ultimate productivity tool designed to help you stay organized, focused, and on top of your tasks. Whether you're managing personal goals, team projects, or daily to-dos, Task Manager simplifies your workflow with intuitive features like drag-and-drop task organization, real-time updates, and deadline tracking.
                </p>

                {/* Call-to-Action Buttons with Animation */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
                    <p className="text-lg text-gray-100 dark:text-gray-300">
                        Just <span className="font-semibold">Login with Google</span> and use it for free!
                    </p>
                </div>

                {/* Decorative Wave */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg
                        viewBox="0 0 1440 320"
                        className="w-full h-24 md:h-32 text-white dark:text-gray-800"
                    >
                        <path
                            fill="currentColor"
                            fillOpacity="1"
                            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,192C672,203,768,181,864,160C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}