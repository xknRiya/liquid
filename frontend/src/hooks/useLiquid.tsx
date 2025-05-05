import { useContext } from "react";
import { LiquidContext } from "../context/liquid";

export const useLiquid = () => {
    const context = useContext(LiquidContext);

    if (!context) throw new Error("useLiquid must be used within a LiquidProvider");

    return {
        ...context,
    };
};