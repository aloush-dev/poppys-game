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
        <div className="flex items-center relative w-screen justify-center bg-slate-900">
            <PhaserGame ref={phaserRef} />
            <Toolbar />
        </div>
    );
}

