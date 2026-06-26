import { type ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  color?: string;
};

export function Button({
  variant = "primary",
  fullWidth = false,
  color = "#7c3aed",
  className = "",
  style,
  ...props
}: ButtonProps) {

  const baseStyles = "flex justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200";

  const variantStyles = variant === "primary"
    ? "text-white hover:brightness-110 active:brightness-95"
    : "border bg-zinc-900/50 hover:bg-zinc-800/60 backdrop-blur-sm transition-colors";

  const customStyles: React.CSSProperties = variant === "primary"
    ? {
      backgroundColor: color,
      outlineColor: color,
    }
    : {
      borderColor: color,
      color: color,
      outlineColor: color,
    };

  return (
    <button
      {...props}
      style={{ ...customStyles, ...style }}
      className={`${baseStyles} ${variantStyles} ${fullWidth ? "w-full" : "w-auto"} ${className}`}
    />
  );
}
