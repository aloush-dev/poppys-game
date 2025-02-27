import { Link } from "@tanstack/react-router";
import ReactConfetti from "react-confetti";

export const HomepageHero = () => {
    return (
        <div className="bg-blue-600 text-white relative overflow-hidden">
            <div className="absolute inset-0">
                <ReactConfetti
                    width={window.innerWidth}
                    height={400}
                    recycle={true}
                    gravity={0.01}
                />
            </div>
            <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center relative z-10">
                <img className="mb-10" src="/assets/logo.png" alt="Logo" />
                <p className="text-xl md:text-4xl  mb-8 font-extrabold ">
                    Create, Play, and Rate Platformer Levels!
                </p>
                <div className="space-x-4">
                    <Link
                        to="/create"
                        className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-2 px-4 rounded"
                    >
                        Create a Level
                    </Link>
                    <Link
                        to="/explore"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-2xl font-bold py-2 px-4 rounded"
                    >
                        Play Levels
                    </Link>
                </div>
            </div>
        </div>
    );
};

