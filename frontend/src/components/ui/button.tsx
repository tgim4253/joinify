import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "default"
            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const DropdownButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Remove bottom border radius, keep only top
          "inline-flex items-center justify-center whitespace-nowrap rounded-t-md rounded-b-none px-4 py-2 text-sm font-medium transition focus:outline-none",
          variant === "default"
            ? "bg-gray-500 text-white hover:bg-gray-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
          className
        )}
        {...props}
      />
    );
  }
);
DropdownButton.displayName = "DropdownButton";

export { Button, DropdownButton };