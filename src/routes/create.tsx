import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { Toolbar } from "../game/components/Toolbar";
import { getLevelById } from "../firebase/firestore";
import { useAuth } from "@/lib/useAuth";
import { useLevelEditorStore } from "@/stores/useLevelEditorStore";

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
    const { user } = useAuth();
    const { setLevelData } = useLevelEditorStore();
    const { level } = Route.useLoaderData();

    useEffect(() => {
        if (level) {
            setLevelData(level);
            console.log("Level loaded:", level);
        }
    }, [level, setLevelData]);

    if (user?.uid !== level?.creator) {
        return <div>You do not have permission to edit this level</div>;
    }
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
        </div>
    );
}

