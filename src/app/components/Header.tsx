import { Link } from "@tanstack/react-router";

export const Header = () => {
    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="">
                    <h1 className="text-2xl font-bold">Poppy's World</h1>
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/play" className="hover:text-orange-300">
                                Play
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/create"
                                className="hover:text-orange-300"
                            >
                                Create
                            </Link>
                        </li>
                        <li>
                            <Link to="/explore" className="hover:text-orange-300">
                                Explore
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-orange-300">
                                Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

