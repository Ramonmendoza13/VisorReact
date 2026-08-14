import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import config from "../config/config";
import loadingGif from "../assets/loading.gif";
import { fetchMediaImdbRating } from "../utils/imdb";
import { Search, Film, Tv } from "lucide-react";

function SearchComponent({ searchTerm }) {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const buscar = async () => {
      if (!searchTerm) {
        setResultados([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${config.API_BASE_URL}/search/multi`, {
          params: {
            api_key: config.API_KEY,
            query: searchTerm,
            language: config.LANGUAGE,
          },
        });

        // Filtrar solo películas y series que tengan póster
        const items = (response.data.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );

        // Obtener calificaciones oficiales de IMDb en paralelo para cada resultado
        const itemsWithImdb = await Promise.all(
          items.map(async (item) => {
            const imdbRating = await fetchMediaImdbRating(
              item.id,
              item.media_type,
              item.vote_average
            );
            return {
              ...item,
              imdb_rating: imdbRating,
            };
          })
        );

        if (isMounted) {
          setResultados(itemsWithImdb);
        }
      } catch (error) {
        console.error("Error al buscar:", error);
        if (isMounted) setResultados([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    buscar();

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  const filtrados = resultados.filter((item) => {
    if (filtroTipo === "movie") return item.media_type === "movie";
    if (filtroTipo === "tv") return item.media_type === "tv";
    return true;
  });

  const getYear = (item) => {
    const dateStr = item.release_date || item.first_air_date;
    return dateStr ? new Date(dateStr).getFullYear() : null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <img
          src={loadingGif}
          alt="Buscando..."
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-xl font-bold text-white">
          Buscando títulos para <span className="text-yellow-400">"{searchTerm}"</span>...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Encabezado de búsqueda */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Resultados para <span className="text-yellow-400">"{searchTerm}"</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Se encontraron <strong className="text-white">{filtrados.length}</strong> resultados · Notas oficiales de IMDb
          </p>
        </div>

        {/* Filtro de tipo */}
        {resultados.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 bg-gray-900/90 rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setFiltroTipo("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filtroTipo === "all"
                  ? "bg-yellow-400 text-gray-950 shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Todos ({resultados.length})
            </button>
            <button
              onClick={() => setFiltroTipo("tv")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filtroTipo === "tv"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>Series</span>
            </button>
            <button
              onClick={() => setFiltroTipo("movie")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filtroTipo === "movie"
                  ? "bg-amber-500 text-gray-950 shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Películas</span>
            </button>
          </div>
        )}
      </div>

      {/* Resultados Grid */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {filtrados.map((item) => (
            <MovieCard
              key={`${item.media_type}-${item.id}`}
              id={item.id}
              title={item.title || item.name}
              image={
                item.poster_path
                  ? `${config.IMAGE_BASE_URL}/w500${item.poster_path}`
                  : config.PLACEHOLDER_IMAGE
              }
              type={item.media_type}
              rating={item.imdb_rating}
              year={getYear(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900/40 rounded-3xl border border-white/5 space-y-3">
          <Search className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-gray-300">
            No se encontraron títulos para "{searchTerm}"
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Prueba a revisar la ortografía o buscar con términos más generales (ej: "Batman", "Juego", "Breaking").
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;