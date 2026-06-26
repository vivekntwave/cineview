import { NavLink, useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
export function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const goToSearch = (query?: string) => {
    const trimmed = query?.trim() ?? "";
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const handleSearchSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    goToSearch(searchQuery);
  };

  return (
    <header className="border-b border-gray-800 bg-black">
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
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, tv shows..."
              className="w-64 rounded-full border border-gray-700 bg-transparent px-3 py-2 text-sm text-white outline-hidden focus:border-violet-300"
            />
            <button
              type="submit"
              className="rounded-md border border-gray-700 px-3 py-2 text-sm text-white hover:border-violet-300 cursor-pointer"
            >
              Search
            </button>
          </form>
          <button
            type="button"
            className="rounded-md border border-gray-700 px-3 py-2 text-sm text-white cursor-pointer"
          >
            EN
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 font-medium text-white">
            U
          </div>
        </div>
      </nav>
    </header>
  );
}
