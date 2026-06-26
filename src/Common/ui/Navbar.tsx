import { NavLink } from "react-router";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-black">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-violet-300">CineView</div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-violet-300 underline underline-offset-8 decoration-2 font-medium"
                  : "text-white hover:text-violet-300 transition-colors"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                isActive
                  ? "text-violet-300 underline underline-offset-8 decoration-2 font-medium"
                  : "text-white hover:text-violet-300 transition-colors"
              }
            >
              Watchlist
            </NavLink>

            <NavLink
              to="/collections"
              className={({ isActive }) =>
                isActive
                  ? "text-violet-300 underline underline-offset-8 decoration-2 font-medium"
                  : "text-white hover:text-violet-300 transition-colors"
              }
            >
              Collections
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search movies, tv shows..."
            className="w-64 rounded-full border border-gray-300 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-violet-300"
          />
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-white"
          >
            EN
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-medium">
            U
          </div>

        </div>
      </nav>
    </header>
  );
}
