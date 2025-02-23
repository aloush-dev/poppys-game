import { useState } from "react";

export const SaveLevelModal = ({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: (name: string) => void;
}) => {
    const [levelName, setLevelName] = useState("");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Save Level</h2>
                <input
                    type="text"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    placeholder="Enter level name"
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(levelName)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={!levelName}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

