import config from "../config/config";
import axios from "axios";

// Caché en memoria para evitar peticiones redundantes
const imdbCache = new Map();
const seasonCache = new Map();
const tmdbExternalIdsCache = new Map();

const normalizeOmdbKey = (rawKey = "") => {
  if (!rawKey) return "";
  const match = rawKey.match(/apikey=([^&]+)/i);
  return match ? match[1] : rawKey.trim();
};

export const hasOmdbKey = () => Boolean(normalizeOmdbKey(config.OMDB_API_KEY));

const parseRating = (data) => {
  if (!data || data.Response === "False") return null;
  const ratingRaw = data.imdbRating;
  return ratingRaw && ratingRaw !== "N/A" ? parseFloat(ratingRaw) : null;
};

/**
 * Obtiene el ID de IMDb a partir del ID de TMDB de una serie
 * @param {string|number} tvTmdbId 
 * @returns {Promise<string|null>} imdb_id (ej. "tt0944947")
 */
export const fetchSeriesImdbId = async (tvTmdbId) => {
  if (!tvTmdbId) return null;
  const cacheKey = `tv_${tvTmdbId}`;
  if (tmdbExternalIdsCache.has(cacheKey)) {
    return tmdbExternalIdsCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/tv/${tvTmdbId}/external_ids`, {
      params: {
        api_key: config.API_KEY,
      },
    });

    const imdbId = response.data?.imdb_id || null;
    tmdbExternalIdsCache.set(cacheKey, imdbId);
    return imdbId;
  } catch (error) {
    console.error("Error al obtener external_ids de TMDB:", error);
    return null;
  }
};

/**
 * Obtiene el ID de IMDb a partir del ID de TMDB de una película
 * @param {string|number} movieTmdbId 
 * @returns {Promise<string|null>} imdb_id (ej. "tt1375666")
 */
export const fetchMovieImdbId = async (movieTmdbId) => {
  if (!movieTmdbId) return null;
  const cacheKey = `movie_${movieTmdbId}`;
  if (tmdbExternalIdsCache.has(cacheKey)) {
    return tmdbExternalIdsCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/movie/${movieTmdbId}/external_ids`, {
      params: {
        api_key: config.API_KEY,
      },
    });

    const imdbId = response.data?.imdb_id || null;
    tmdbExternalIdsCache.set(cacheKey, imdbId);
    return imdbId;
  } catch (error) {
    console.error("Error al obtener external_ids de película:", error);
    return null;
  }
};

/**
 * Obtiene la puntuación general de IMDb para una película o serie dado su imdb_id (tt...)
 * @param {string} imdbId 
 * @returns {Promise<number|null>} Puntuación numérica (ej: 8.8) o null
 */
export const fetchImdbRating = async (imdbId) => {
  const apiKey = normalizeOmdbKey(config.OMDB_API_KEY);
  if (!imdbId || !apiKey || !imdbId.startsWith("tt")) return null;
  if (imdbCache.has(imdbId)) return imdbCache.get(imdbId);

  const url = `${config.OMDB_BASE_URL}/?apikey=${apiKey}&i=${imdbId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rating = parseRating(data);
    imdbCache.set(imdbId, rating);
    return rating;
  } catch (error) {
    console.error("Error al obtener nota IMDb:", error);
    imdbCache.set(imdbId, null);
    return null;
  }
};

/**
 * Obtiene la nota de IMDb para cualquier elemento de TMDB (película o serie)
 * @param {string|number} tmdbId 
 * @param {"movie"|"tv"} mediaType 
 * @param {number|null} fallbackVoteAverage 
 * @returns {Promise<number|null>}
 */
export const fetchMediaImdbRating = async (tmdbId, mediaType = "tv", fallbackVoteAverage = null) => {
  try {
    let imdbId = null;
    if (mediaType === "tv") {
      imdbId = await fetchSeriesImdbId(tmdbId);
    } else if (mediaType === "movie") {
      imdbId = await fetchMovieImdbId(tmdbId);
    }

    if (imdbId) {
      const rating = await fetchImdbRating(imdbId);
      if (rating !== null && rating !== undefined) {
        return rating;
      }
    }
  } catch (err) {
    console.error("Error al consultar nota IMDb:", err);
  }

  return fallbackVoteAverage ? parseFloat(Number(fallbackVoteAverage).toFixed(1)) : null;
};

/**
 * Obtiene las notas de IMDb de todos los episodios de una temporada completa
 * @param {string} seriesImdbId - ID de IMDb de la serie (ej: "tt0944947")
 * @param {number|string} seasonNumber - Número de temporada
 * @returns {Promise<Object.<number, number|null>>} Mapa de episodio -> nota { 1: 8.9, 2: 8.6, ... }
 */
export const fetchSeasonRatings = async (seriesImdbId, seasonNumber) => {
  const apiKey = normalizeOmdbKey(config.OMDB_API_KEY);
  if (!seriesImdbId || !apiKey || !seriesImdbId.startsWith("tt") || !seasonNumber) {
    return {};
  }

  const cacheKey = `${seriesImdbId}_S${seasonNumber}`;
  if (seasonCache.has(cacheKey)) {
    return seasonCache.get(cacheKey);
  }

  const url = `${config.OMDB_BASE_URL}/?apikey=${apiKey}&i=${seriesImdbId}&Season=${seasonNumber}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const ratingsMap = {};
    if (data && data.Response !== "False" && Array.isArray(data.Episodes)) {
      data.Episodes.forEach((ep) => {
        const epNum = parseInt(ep.Episode, 10);
        if (!isNaN(epNum)) {
          const rating = ep.imdbRating && ep.imdbRating !== "N/A" ? parseFloat(ep.imdbRating) : null;
          ratingsMap[epNum] = rating;
        }
      });
    }

    seasonCache.set(cacheKey, ratingsMap);
    return ratingsMap;
  } catch (error) {
    console.error(`Error al obtener notas IMDb de la temporada ${seasonNumber}:`, error);
    seasonCache.set(cacheKey, {});
    return {};
  }
};
