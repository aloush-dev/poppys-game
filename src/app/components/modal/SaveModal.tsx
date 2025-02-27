import { SaveLevelToDb } from "@/firebase/firestore";
import { useAuthStore } from "@/stores/useAuthStore";

import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { useModalStore } from "@/stores/useModalStore";
import { useState } from "react";

export const SaveModal = ({ title = "Save Level" }: { title?: string }) => {
    const [levelName, setLevelName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { levelData, setLevelData } = useLevelEditorStore();
    const { user } = useAuthStore();
    const { closeModal } = useModalStore();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const savedLevel = await SaveLevelToDb(
                {
                    ...levelData,
                    name: levelName,
                    creator: user?.uid,
                },
                levelData.id,
            );
            if (savedLevel) {
                setLevelData({
                    ...levelData,
                    name: levelName,
                    id: savedLevel.id,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-700">{title}</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-between">
                    <input
                        value={levelName}
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.stopPropagation();
                            }
                        }}
                        onChange={(e) => setLevelName(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter level name"
                        disabled={loading}
                    />

                    <button
                        onClick={handleSubmit}
                        className={`mt-4 px-4 py-2 rounded-lg ${
                            loading
                                ? "bg-blue-300"
                                : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition-colors duration-200 flex items-center gap-2`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

