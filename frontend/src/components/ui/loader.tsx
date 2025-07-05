import { MoonLoader } from "react-spinners";
import * as React from "react";
import { cn } from "../../lib/utils";

interface Spinners extends React.HTMLAttributes<HTMLDivElement> { 
    size?: number;
    color?: string;
}

const MoonLoaderSpinner = React.forwardRef<HTMLDivElement, Spinners>(
    ({ className, size, color, ...props }, ref) => {
        size = size || 60;
        color = color || "#6366f1";
        return (
            <MoonLoader className={cn(
                "h-10 w-full",
                className
            )} size={size} color={color} />
        );
    }
);
MoonLoaderSpinner.displayName = "MoonLoaderSpinner";

export {
    MoonLoaderSpinner
};