import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MovieCard from "./MovieCard.jsx";
import config from "../config/config";
import { Bookmark, Film, Tv, LogOut, User, Search } from "lucide-react";

function ZonaPrivComponent() {
  const { token, user, logout } = useAuth();
  const [watchList, setWatchList] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("all");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (!token) {
      setCargando(false);
      return;
    }
    const fetchWatchList = async () => {
      try {
        setCargando(true);

        const response = await fetch(`${config.API_VISOR_URL}/watchlists`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de seguimiento");
        }

        const data = await response.json();

        if (data.watchlists && data.watchlists.length > 0) {
          const watchlistPromises = data.watchlists.map(async (item) => {
            try {
              const movieResponse = await fetch(
                `${config.API_BASE_URL}/${item.media_type}/${item.imdb_id}?api_key=${config.API_KEY}&language=${config.LANGUAGE}`
              );

              if (!movieResponse.ok) {
                return null;
              }

              const movieData = await movieResponse.json();
              return { ...item, ...movieData };
            } catch (error) {
              console.error(`Error procesando ${item.imdb_id}:`, error);
              return null;
            }
          });

          const watchlistWithDetails = await Promise.all(watchlistPromises);
          const validWatchlist = watchlistWithDetails.filter((item) => item !== null);
          setWatchList(validWatchlist);
        } else {
          setWatchList([]);
        }
      } catch (error) {
        console.error("Error general:", error);
        setWatchList([]);
      } finally {
        setCargando(false);
      }
    };

    fetchWatchList();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-300 font-medium">Cargando tu lista de seguimiento...</p>
      </div>
    );
  }

  // Filtrado
  const itemsFiltrados = watchList.filter((item) => {
    const titulo = (item.title || item.name || "").toLowerCase();
    const coincideTexto = titulo.includes(busqueda.toLowerCase());
    if (!coincideTexto) return false;

    if (filtroTipo === "movie") return item.media_type === "movie";
    if (filtroTipo === "tv") return item.media_type === "tv";
    return true;
  });

  const countPelis = watchList.filter((i) => i.media_type === "movie").length;
  const countSeries = watchList.filter((i) => i.media_type === "tv").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header del Perfil */}
      <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#141b29] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-300 text-gray-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shadow-yellow-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                Tu Panel Privado
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {user?.name}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Estadísticas y Logout */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <div className="bg-gray-950/80 border border-white/10 px-3 py-2 rounded-xl text-center">
                <span className="block text-xs text-gray-400 font-medium">Total</span>
                <span className="text-sm sm:text-base font-black text-yellow-400">
                  {watchList.length}
                </span>
              </div>
              <div className="bg-gray-950/80 border border-white/10 px-3 py-2 rounded-xl text-center">
                <span className="block text-xs text-gray-400 font-medium">Series</span>
                <span className="text-sm sm:text-base font-black text-blue-400">
                  {countSeries}
                </span>
              </div>
              <div className="bg-gray-950/80 border border-white/10 px-3 py-2 rounded-xl text-center">
                <span className="block text-xs text-gray-400 font-medium">Películas</span>
                <span className="text-sm sm:text-base font-black text-amber-400">
                  {countPelis}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition shadow-sm"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controles de la Watchlist */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tu Lista de Seguimiento
            </h2>
            <span className="text-xs bg-gray-800 text-gray-300 font-bold px-2.5 py-0.5 rounded-full border border-white/5">
              {itemsFiltrados.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Buscador local */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar en favoritos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-900 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/40"
              />
            </div>

            {/* Filtro de tipos */}
            <div className="flex items-center gap-1 p-1 bg-gray-900 rounded-xl border border-white/10">
              <button
                onClick={() => setFiltroTipo("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filtroTipo === "all"
                    ? "bg-yellow-400 text-gray-950 shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroTipo("tv")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filtroTipo === "tv"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Series
              </button>
              <button
                onClick={() => setFiltroTipo("movie")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filtroTipo === "movie"
                    ? "bg-amber-500 text-gray-950 shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Películas
              </button>
            </div>
          </div>
        </div>

        {/* Rejilla de Favoritos */}
        {itemsFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
            {itemsFiltrados.map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                image={`${config.IMAGE_BASE_URL}/w500${item.poster_path}`}
                type={item.media_type}
                rating={item.vote_average}
                year={
                  item.release_date
                    ? new Date(item.release_date).getFullYear()
                    : item.first_air_date
                    ? new Date(item.first_air_date).getFullYear()
                    : null
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/40 rounded-3xl border border-white/5 space-y-3">
            <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-gray-300">
              {watchList.length === 0
                ? "Aún no tienes elementos en tu Watchlist"
                : "No hay coincidencias con tu filtro"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              {watchList.length === 0
                ? "Explora el catálogo y pulsa 'Guardar' en las películas o series que quieras seguir."
                : "Intenta cambiar el término de búsqueda o el tipo de contenido seleccionado."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ZonaPrivComponent;