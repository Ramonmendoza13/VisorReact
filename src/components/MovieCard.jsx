import { Link } from "react-router-dom";
import config from "../config/config";
import { Star } from "lucide-react";

function MovieCard({ title, image, id, type, rating, year }) {
  const isTv = type === "tv";

  return (
    <Link
      to={`/mostrar/${type}/${encodeURIComponent(title)}/${id}`}
      className="group relative flex flex-col rounded-2xl bg-gray-900/60 hover:bg-gray-800/80 border border-white/5 hover:border-yellow-400/40 p-2 sm:p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 cursor-pointer overflow-hidden"
    >
      {/* Contenedor del póster */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-950 shadow-inner">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = config.PLACEHOLDER_IMAGE;
          }}
        />

        {/* Gradiente oscuro sutil sobre el póster */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badge de tipo (SERIE / PELI) */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md backdrop-blur-md ${
              isTv
                ? "bg-blue-600/90 text-white border border-blue-400/30"
                : "bg-amber-500/90 text-gray-950 border border-amber-300/40"
            }`}
          >
            {isTv ? "Serie" : "Película"}
          </span>
        </div>

        {/* Calificación si está disponible */}
        {rating !== undefined && rating !== null && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-gray-950/85 backdrop-blur-md border border-white/10 px-1.5 py-0.5 rounded-md shadow">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-bold text-white">
              {Number(rating).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info inferior */}
      <div className="mt-2.5 px-1 flex flex-col flex-1 justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-gray-100 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
          {title}
        </h2>

        {year && (
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            {year}
          </span>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
