import { createFileRoute, Link } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import LoginSignupForm from "../app/components/LoginSignUpForm";
import { BadgePlus, Play, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div className="min-h-noheader-screen bg-gray-100">
            <div className="bg-blue-600 text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Poppy's World
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Create, Play, and Rate Platformer Levels!
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/create"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create a Level
                        </Link>
                        <Link
                            to="/explore"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Play Levels
                        </Link>
                    </div>
                </div>
            </div>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Game Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Create Levels"
                            icon={
                                <BadgePlus
                                    className="text-yellow-500"
                                    size={48}
                                />
                            }
                            description="Use the level editor to create your own platformer levels. Add blocks, enemies, and more!"
                        />
                        <FeatureCard
                            title="Play Levels"
                            icon={
                                <Play className="text-yellow-500" size={48} />
                            }
                            description="Play levels created by other users. Rate them and leave feedback!"
                        />
                        <FeatureCard
                            title="Leaderboards"
                            icon={
                                <Trophy className="text-yellow-500" size={48} />
                            }
                            description="Compete with other players for the fastest time on each level."
                        />
                    </div>
                </div>
            </section>

            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="float-right text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        <LoginSignupForm
                            onClose={() => setShowLoginModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const FeatureCard = ({
    title,
    icon,
    description,
}: {
    title: string;
    icon: ReactNode;
    description: string;
}) => (
    <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center mb-4">{icon}</div>
        <p>{description}</p>
    </div>
);

