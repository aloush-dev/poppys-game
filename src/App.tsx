import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Toolbar } from "./components/Toolbar";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div className="flex items-center relative h-screen w-screen justify-center bg-slate-900">
            <PhaserGame ref={phaserRef} />
            <Toolbar />
        </div>
    );
}

export default App;

