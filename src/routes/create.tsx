import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { Toolbar } from "../game/components/Toolbar";

export const Route = createFileRoute("/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-slate-900 p-4">
            <div className="flex gap-4 w-full max-w-[960px]">
                <div className="flex justify-center">
                    <Toolbar />
                </div>
                <div className="relative w-full aspect-[3/2]">
                    <PhaserGame ref={phaserRef} scene="create" />
                </div>
            </div>
        </div>
    );
}

