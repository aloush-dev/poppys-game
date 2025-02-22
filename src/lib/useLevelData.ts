import { useContext } from "react";
import { LevelDataContext } from "./LevelDataContext";

export const useLevelData = () => {
    const context = useContext(LevelDataContext);

    if (!context) {
        throw new Error("useLevelData must be used within a LevelDataProvider");
    }

    return context;
};

