import config from "../config/config";

const imdbCache = new Map();

const normalizeOmdbKey = (rawKey = "") => {
  if (!rawKey) return "";
  const match = rawKey.match(/apikey=([^&]+)/i);
  return match ? match[1] : rawKey.trim();
};

const jsonp = (url, timeoutMs = 8000) =>
  new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement("script");

    const cleanup = () => {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, timeoutMs);

    window[callbackName] = (data) => {
      clearTimeout(timer);
      cleanup();
      resolve(data);
    };

    script.src = `${url}&callback=${callbackName}`;
    script.onerror = () => {
      clearTimeout(timer);
      cleanup();
      reject(new Error("JSONP error"));
    };

    document.body.appendChild(script);
  });

export const hasOmdbKey = () => Boolean(normalizeOmdbKey(config.OMDB_API_KEY));

const parseRating = (data) => {
  if (!data || data.Response === "False") return null;
  const ratingRaw = data.imdbRating;
  return ratingRaw && ratingRaw !== "N/A" ? parseFloat(ratingRaw) : null;
};

export const fetchImdbRating = async (imdbId) => {
  const apiKey = normalizeOmdbKey(config.OMDB_API_KEY);
  if (!imdbId || !apiKey || !imdbId.startsWith("tt")) return null;
  if (imdbCache.has(imdbId)) return imdbCache.get(imdbId);

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rating = parseRating(data);
    imdbCache.set(imdbId, rating);
    return rating;
  } catch (error) {
    try {
      const data = await jsonp(url);
      const rating = parseRating(data);
      imdbCache.set(imdbId, rating);
      return rating;
    } catch (jsonpError) {
      console.error("Error al obtener nota IMDb:", jsonpError);
      imdbCache.set(imdbId, null);
      return null;
    }
  }
};
