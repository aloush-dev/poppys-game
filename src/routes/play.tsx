import { createFileRoute } from "@tanstack/react-router";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { useRef } from "react";

export const Route = createFileRoute("/play")({
    component: RouteComponent,
});

function RouteComponent() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div>
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

