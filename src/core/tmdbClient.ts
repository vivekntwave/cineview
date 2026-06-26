import { type z } from "zod";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function tmdbFetch<T>(
  endpoint: string,
  schema: z.Schema<T>,
): Promise<T> {
  if (!TMDB_TOKEN) {
    throw new Error(
      "Missing VITE_TMDB_ACCESS_TOKEN configuration inside your environmental variables.",
    );
  }

  const path = endpoint.split("?")[0] ?? endpoint;
  const isDetailEndpoint = /^\/(?:movie|tv)\/\d+$/.test(path);
  const separator = endpoint.includes("?") ? "&" : "?";
  const extendedEndpoint =
    endpoint.includes("append_to_response") || !isDetailEndpoint
      ? endpoint
      : `${endpoint}${separator}append_to_response=videos,credits`;

  const response = await fetch(`${TMDB_BASE_URL}${extendedEndpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("ENTITY_NOT_FOUND");
    }
    throw new Error(
      `TMDB Gateway connection failure: status code ${response.status}`,
    );
  }

  const rawJSON = await response.json();

  return schema.parse(rawJSON);
}
