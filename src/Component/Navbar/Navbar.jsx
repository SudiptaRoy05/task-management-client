
export default function Navbar() {
    return (
        <div className="bg-gray-900">
            <div className="navbar w-10/12 mx-auto">
                <div className="flex-1">
                    <a className="text-white font-bold text-xl">WorkFlow</a>
                </div>
                <div className="flex-none gap-2">
                    <button className="text-white">Login</button>
                </div>
            </div>
        </div>
    )
}
