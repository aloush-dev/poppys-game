import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { Toolbar } from "../game/components/Toolbar";
import { useAuth } from "../lib/useAuth";
import { EventBus } from "../game/EventBus";
import { ErrorModal } from "../app/components/ErrorModal";
import { SaveLevelModal } from "../app/components/SaveModal";

export const Route = createFileRoute("/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleError = (message: string) => {
            setError(message);
        };

        const handleSaveLevel = () => {
            if (!user) {
                setError("You must be logged in to save a level");
                return;
            }
            setShowSaveModal(true);
        };

        EventBus.on("error", handleError);
        EventBus.on("saveLevel", handleSaveLevel);

        return () => {
            EventBus.off("error", handleError);
            EventBus.off("saveLevel", handleSaveLevel);
        };
    }, [user]);

    const handleSaveLevel = (levelName: string) => {
        EventBus.emit("publishLevel", levelName, user?.uid);
        setShowSaveModal(false);
    };

    if (!user) {
        return <div>You must be logged in to create a level</div>;
    }

    return (
        <div className="flex items-center justify-center h-noheader-screen w-full bg-slate-900 p-4">
            <div className="flex gap-4 w-full justify-center">
                <Toolbar />
                <div className="relative w-full max-w-[960px] aspect-[3/2]">
                    <PhaserGame ref={phaserRef} scene="create" />
                </div>
            </div>

            {error && (
                <ErrorModal errorMsg={error} onClose={() => setError(null)} />
            )}

            {showSaveModal && (
                <SaveLevelModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={handleSaveLevel}
                />
            )}
        </div>
    );
}

