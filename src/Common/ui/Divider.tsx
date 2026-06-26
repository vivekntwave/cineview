import { type ReactNode } from "react";

type DividerProps = {
  children?: ReactNode;
};

export function Divider({ children }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-500" />
      </div>
      {children && (
        <div className="relative flex justify-center text-xs text-transform uppercase">
          <span className="bg-black px-2 text-gray-500">{children}</span>
        </div>
      )}
    </div>
  );
}
