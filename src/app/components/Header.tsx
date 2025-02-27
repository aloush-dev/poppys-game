import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, BookMarked, Layers } from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";

export const Header = () => {
    const { user, logout } = useAuthStore();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { openModal } = useModalStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-blue-600 text-white shadow-lg h-16 relative">
            <div className="container mx-auto px-4 h-full flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold hover:text-orange-300 transition-colors"
                >
                    Poppy's World
                </Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link
                                to="/create"
                                className="hover:text-orange-300 transition-colors"
                            >
                                Create
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/explore"
                                className="hover:text-orange-300 transition-colors"
                            >
                                Explore
                            </Link>
                        </li>
                        <li>
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() =>
                                            setProfileDropdownOpen(
                                                !profileDropdownOpen,
                                            )
                                        }
                                        className="flex items-center space-x-2 bg-primary-foreground text-primary px-4 py-2 rounded-full hover:bg-orange-300 hover:text-primary transition-colors"
                                    >
                                        <User size={18} />
                                        <span>
                                            {user.displayName ?? "User"}
                                        </span>
                                    </button>
                                    {profileDropdownOpen && (
                                        <div className="absolute top-12 right-0 w-48 z-100 bg-white text-black shadow-lg rounded-md overflow-hidden">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                                onClick={() =>
                                                    setProfileDropdownOpen(
                                                        false,
                                                    )
                                                }
                                            >
                                                <User
                                                    size={18}
                                                    className="inline-block mr-2"
                                                />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/profile/saved-levels"
                                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                                onClick={() =>
                                                    setProfileDropdownOpen(
                                                        false,
                                                    )
                                                }
                                            >
                                                <BookMarked
                                                    size={18}
                                                    className="inline-block mr-2"
                                                />
                                                Saved Levels
                                            </Link>
                                            <Link
                                                to="/profile/published-levels"
                                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                                onClick={() =>
                                                    setProfileDropdownOpen(
                                                        false,
                                                    )
                                                }
                                            >
                                                <Layers
                                                    size={18}
                                                    className="inline-block mr-2"
                                                />
                                                Published Levels
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(
                                                        false,
                                                    );
                                                    logout();
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                                            >
                                                <LogOut
                                                    size={18}
                                                    className="inline-block mr-2"
                                                />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        openModal("login");
                                    }}
                                    className="bg-primary-foreground text-primary px-4 py-2 rounded-full hover:bg-orange-300 transition-colors"
                                >
                                    Login / Sign Up
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

