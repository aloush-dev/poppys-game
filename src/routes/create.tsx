import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { Toolbar } from "../game/components/Toolbar";
import { useAuth } from "../lib/useAuth";
// import { EventBus } from "../game/EventBus";
// import { ErrorModal } from "../app/components/ErrorModal";
// import { SaveLevelModal } from "../app/components/SaveModal";
import { getLevelById } from "../firebase/firestore";

interface SearchParams {
    levelId?: string;
}

export const Route = createFileRoute("/create")({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): SearchParams => {
        return {
            levelId: search.levelId as string | undefined,
        };
    },
    loaderDeps: ({ search: { levelId } }: { search: SearchParams }) => [
        levelId,
    ],
    loader: async ({ deps: [levelId] }) => {
        if (!levelId) {
            return { level: null };
        }

        try {
            const level = await getLevelById(levelId);
            if (!level) {
                throw new Error("Level not found");
            }
            return { level };
        } catch (error) {
            throw new Error("Failed to load level");
        }
    },
    errorComponent: ({ error }) => (
        <div className="text-red-500">Error: {error.message}</div>
    ),
});

function RouteComponent() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    // const [error, setError] = useState<string | null>(null);
    // const [showSaveModal, setShowSaveModal] = useState(false);
    // const [showPublishModal, setShowPublishModal] = useState(false);
    const { user } = useAuth();

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

            {/* {error && (
                <ErrorModal errorMsg={error} onClose={() => setError(null)} />
            )} */}

            {/* {showSaveModal && (
                <SaveLevelModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={handleSaveLevel}
                    initialName={level?.name}
                />
            )} */}

            {/* {showPublishModal && (
                <PublishModal
                    onClose={() => setShowPublishModal(false)}
                    onPublish={handlePublishLevel}
                />
            )} */}
        </div>
    );
}

