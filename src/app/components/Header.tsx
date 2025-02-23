import { Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/useAuth";

export const Header = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const { user } = useAuth();
    return (
        <header className="bg-blue-600 text-white shadow-lg h-[4rem]">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="">
                    <h1 className="text-2xl font-bold">Poppy's World</h1>
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link
                                to="/create"
                                className="hover:text-orange-300"
                            >
                                Create
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/explore"
                                className="hover:text-orange-300"
                            >
                                Explore
                            </Link>
                        </li>
                        <li>
                            {user ? (
                                <div>
                                    {user.displayName ?? 'USER'}
                                </div>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
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

