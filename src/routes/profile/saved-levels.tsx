import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../lib/useAuth";
import { getSavedLevelsByUserId } from "../../firebase/firestore";
import { useEffect, useState } from "react";
import { SavedLevel } from "../../lib/types";
import { SavedLevelCard } from "../../app/components/LevelCards";

export const Route = createFileRoute("/profile/saved-levels")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();
    const [levels, setLevels] = useState<SavedLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLevels() {
            if (!user) return;

            try {
                const userLevels = await getSavedLevelsByUserId(user.uid);
                setLevels(userLevels);
            } catch (err) {
                setError("Failed to load saved levels");
            } finally {
                setLoading(false);
            }
        }

        fetchLevels();
    }, [user]);

    if (!user) {
        navigate({ to: "/login" });
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Saved Levels</h1>
            <div className="max-w-6xl m-10">
                <div className="flex flex-col md:flex-row mb-6 gap-4">
                    {levels.length === 0 && <p>No saved levels</p>}
                    {levels.map((level) => (
                        <SavedLevelCard key={level.id} level={level} />
                    ))}
                </div>
            </div>
        </div>
    );
}

