import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/useAuth";
import { useState } from "react";
import LoginSignupForm from "../app/components/LoginSignUpForm";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const navigate = useNavigate();

    const handleCreateLevel = () => {
        if (user) {
            navigate({ to: "/create" });
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <div className="min-h-noheader-screen bg-gray-100">
            <header className="bg-blue-600 text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Poppy's World
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Create, Play, and Rate Platformer Levels!
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={handleCreateLevel}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create a Level
                        </button>
                        <Link
                            to="/explore"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Play Levels
                        </Link>
                    </div>
                </div>
            </header>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Game Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">
                                Create Levels
                            </h3>
                            <p>
                                Design your own challenging platformer levels
                                with our intuitive level editor.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">
                                Play Levels
                            </h3>
                            <p>
                                Explore and enjoy a vast collection of
                                user-created levels.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">
                                Rate and Comment
                            </h3>
                            <p>
                                Share your thoughts and rate levels created by
                                the community.
                            </p>
                        </div>
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

