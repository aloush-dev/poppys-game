import { useState } from "react";

interface PublishModalProps {
    onClose: () => void;
    onPublish: (levelName: string) => void;
}

export const PublishModal = ({ onClose, onPublish }: PublishModalProps) => {
    const [levelName, setLevelName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (levelName.trim()) {
            onPublish(levelName);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Publish Level</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={levelName}
                        onChange={(e) => setLevelName(e.target.value)}
                        placeholder="Enter level name"
                        className="w-full p-2 border rounded mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={!levelName.trim()}
                        >
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

