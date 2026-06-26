import { NavLink } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-black px-6 py-2.5">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 md:flex-row md:items-center">

        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
          <p className="text-base font-semibold text-white">CineView</p>
          <p className="text-xs text-gray-500">
            The world's leading entertainment discovery platform.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:gap-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            <NavLink className="hover:text-violet-500 transition-colors" to="/about">
              About
            </NavLink>
            <NavLink className="hover:text-violet-500 transition-colors" to="/privacy">
              Privacy Policy
            </NavLink>
            <NavLink className="hover:text-violet-500 transition-colors" to="/terms">
              Terms of Service
            </NavLink>
            <NavLink className="hover:text-violet-500 transition-colors" to="/contact">
              Contact
            </NavLink>
          </div>

          <p className="text-[11px] text-gray-400 whitespace-nowrap">
            © 2026 CineView · Data by TMDB
          </p>
        </div>

      </div>
    </footer>
  );
}
