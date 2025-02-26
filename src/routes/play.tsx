import { createFileRoute } from "@tanstack/react-router";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { useEffect, useRef } from "react";
import { getLevelById } from "@/firebase/firestore";
import { usePlayGameStore } from "@/stores/usePlayGameStore";

interface SearchParams {
    levelId?: string;
}

export const Route = createFileRoute("/play")({
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
    const { level } = Route.useLoaderData();

    const { setLevel } = usePlayGameStore();

    useEffect(() => {
        if (level) {
            setLevel(level);
        }
    }, [level, setLevel]);

    return (
        <div className="flex flex-col items-center justify-center h-noheader-screen w-full bg-slate-900 p-4">
            <div className="relative w-full max-w-[960px] aspect-[3/2]">
                <PhaserGame ref={phaserRef} scene="play" />
            </div>
        </div>
    );
}

