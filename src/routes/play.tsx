import { createFileRoute } from "@tanstack/react-router";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { useRef } from "react";

export const Route = createFileRoute("/play")({
    component: RouteComponent,
});

function RouteComponent() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 p-4">
            <div className="relative w-full max-w-[960px] aspect-[3/2]">
                <PhaserGame ref={phaserRef} scene="play" />
            </div>
        </div>
    );
}

