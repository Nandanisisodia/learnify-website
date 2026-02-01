// src/components/Navbar.js
import React, { useState } from "react";
import {
    Menu,
    X,
    Home,
    Users,
    Building2,
    Folder,
    BarChart3,
    MessageSquare,
} from "lucide-react";

const Navbar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeItem, setActiveItem] = useState("Analytics");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { name: "Dashboard", icon: <Home size={18} /> },
        { name: "Students", icon: <Users size={18} /> },
        { name: "Companies", icon: <Building2 size={18} /> },
        { name: "Projects", icon: <Folder size={18} /> },
        { name: "Analytics", icon: <BarChart3 size={18} /> },
        { name: "Mentor Reviews", icon: <MessageSquare size={18} /> },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`bg-[#0D1B2A] text-white h-full transition-all duration-300 ${isOpen ? "w-64" : "w-0"
                    } overflow-hidden`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-green-400">LEARNIFY</h1>
                </div>

                {/* Menu Items */}
                <nav className="mt-4 flex flex-col space-y-2 px-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveItem(item.name)}
                            className={`flex items-center gap-3 p-2 rounded-lg transition ${activeItem === item.name
                                ? "bg-blue-600"
                                : "hover:bg-blue-600"
                                }`}
                        >
                            {item.icon} {item.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 transition-all duration-300">
                <div className="p-6">{children}</div>
            </div>

            {/* 🔥 Fixed Toggle Button (always visible) */}
            <button
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
                onClick={toggleSidebar}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
    );
};

export default Navbar;
