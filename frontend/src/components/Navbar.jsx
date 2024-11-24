// eslint-disable-next-line no-unused-vars
import React from "react";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            {/* Logo */}
            <div className="text-xl font-bold">🎟️ TicketApp</div>
            {/* Search Bar */}
            <div className="flex-grow mx-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
            </div>
            {/* Login/Logout */}
            <div>
                <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
