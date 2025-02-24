import type React from "react";
import { type FormEvent, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { createDBUser } from "../../firebase/firestore";

interface LoginSignupFormProps {
    onClose?: () => void;
}

const LoginSignupForm: React.FC<LoginSignupFormProps> = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                ).then(async (data) => {
                    if (auth.currentUser) {
                        try {
                            await createDBUser(data.user.uid, username);
                        } catch (error) {
                            console.error("Error creating user", error);
                            setError("Error creating user, please try again");
                            if (error instanceof Error) {
                                throw error;
                            }
                        }
                    }
                });
            }
            if (onClose) onClose();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
                {isLogin ? "Login" : "Sign Up"}
            </h2>
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div>
                <label htmlFor="email" className="block mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="username" className="block mb-1">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block mb-1">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>
            {!isLogin && (
                <div>
                    <label htmlFor="confirmPassword" className="block mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
            )}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                {isLogin ? "Login" : "Sign Up"}
            </button>
            <p className="text-center">
                {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                    }}
                    className="text-blue-500 hover:underline"
                >
                    {isLogin ? "Sign Up" : "Login"}
                </button>
            </p>
        </form>
    );
};

export default LoginSignupForm;

