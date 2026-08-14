import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, User, Bookmark, Film, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function HeaderComponent() {
  const [titulo, setTitulo] = useState("");
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleBuscar = (e) => {
    if (e) e.preventDefault();
    if (titulo.trim() !== "") {
      navigate(`/buscar/${encodeURIComponent(titulo.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 py-3.5 sm:py-4">
          
          {/* Logo y Nombre */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-102"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/30 transition">
                <Film className="w-5 h-5 text-gray-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-wider text-white">
                    VISOR
                  </span>                  
                </div>
                <span className="text-[11px] text-gray-400 font-medium tracking-tight -mt-1 hidden sm:inline">
                  Puntuaciones de Series & Películas
                </span>
              </div>
            </Link>

            {/* Botón de usuario en móvil (arriba a la derecha) */}
            <div className="sm:hidden">
              {!token ? (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/10 transition"
                >
                  <User className="w-4 h-4 text-yellow-400" />
                  <span>Login</span>
                </Link>
              ) : (
                <Link
                  to="/zonaPrivada"
                  className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Favoritos</span>
                </Link>
              )}
            </div>
          </div>

          {/* Barra de búsqueda central */}
          <form
            onSubmit={handleBuscar}
            className="w-full sm:max-w-md lg:max-w-lg relative flex items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Buscar película, serie, actor..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-900/90 border border-white/10 hover:border-white/20 focus:border-yellow-400/80 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition shadow-inner"
              />
              {titulo && (
                <button
                  type="button"
                  onClick={() => setTitulo("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="hidden sm:inline-flex ml-2 bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-gray-950 font-bold px-4 py-2 sm:py-2.5 rounded-xl text-sm shadow-md transition items-center gap-1.5 flex-shrink-0"
            >
              Buscar
            </button>
          </form>

          {/* Acciones de usuario en Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            {!token ? (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/10 transition shadow-sm"
              >
                <User className="w-4 h-4 text-yellow-400" />
                <span>Iniciar Sesión</span>
              </Link>
            ) : (
              <Link
                to="/zonaPrivada"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-gray-950 text-sm font-extrabold px-4 py-2 rounded-xl shadow-md shadow-yellow-500/20 transition"
              >
                <Bookmark className="w-4 h-4" />
                <span>{user?.name ? user.name.split(" ")[0] : "Mi Watchlist"}</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
