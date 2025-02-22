import { createContext, ReactNode, useState } from "react";
import { LevelData, TempLevelData } from "./types";

interface LevelDataContextProps {
    levelData: LevelData | TempLevelData | null;
    setLevelData: (levelData: LevelData | TempLevelData | null) => void;
}

export const LevelDataContext = createContext<LevelDataContextProps | null>({
    levelData: null,
    setLevelData: () => {},
});

export const LevelDataProvider = ({ children }: { children: ReactNode }) => {
    const [levelData, setLevelData] = useState<
        LevelData | TempLevelData | null
    >(null);

    return (
        <LevelDataContext.Provider value={{ levelData, setLevelData }}>
            {children}
        </LevelDataContext.Provider>
    );
};

