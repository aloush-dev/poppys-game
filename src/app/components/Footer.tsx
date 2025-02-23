export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-xl font-semibold mb-2">
                            Platform Creator
                        </h3>
                        <p>
                            Create, play, and share amazing platformer levels!
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-xl font-semibold mb-2">
                            Quick Links
                        </h3>
                        <ul>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Create Level
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Play Levels
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Leaderboard
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-semibold mb-2">
                            Connect With Us
                        </h3>
                        <ul>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};
