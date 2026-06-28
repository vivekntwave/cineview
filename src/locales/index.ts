import enCommon from "./en/common.json";
import enAuth from "./en/auth.json";
import enHome from "./en/home.json";
import enSearch from "./en/search.json";
import enMovie from "./en/movie.json";
import enTv from "./en/tv.json";
import enCollection from "./en/collection.json";
import enSettings from "./en/settings.json";

import esCommon from "./es/common.json";
import esAuth from "./es/auth.json";
import esHome from "./es/home.json";
import esSearch from "./es/search.json";
import esMovie from "./es/movie.json";
import esTv from "./es/tv.json";
import esCollection from "./es/collection.json";
import esSettings from "./es/settings.json";

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    search: enSearch,
    movie: enMovie,
    tv: enTv,
    collection: enCollection,
    settings: enSettings,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    home: esHome,
    search: esSearch,
    movie: esMovie,
    tv: esTv,
    collection: esCollection,
    settings: esSettings,
  },
} as const;

export const namespaces = [
  "common",
  "auth",
  "home",
  "search",
  "movie",
  "tv",
  "collection",
  "settings",
] as const;