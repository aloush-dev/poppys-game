import { PublishedLevelCard } from "@/app/components/LevelCards";
import { getPublishedLevelsByUserId } from "@/firebase/firestore";
import { SavedLevel } from "@/lib/types";
import { useAuth } from "@/lib/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile/published-levels")({
    loader: async () => {},
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
                const userLevels = await getPublishedLevelsByUserId(user.uid);
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
                        <PublishedLevelCard key={level.id} level={level} />
                    ))}
                </div>
            </div>
        </div>
    );
}

