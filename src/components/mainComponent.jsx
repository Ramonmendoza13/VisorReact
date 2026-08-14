import React, { useState, useEffect } from "react";
import destacados from "../data/destacados";
import MovieCard from "./MovieCard";
import { fetchMediaImdbRating } from "../utils/imdb";
import { Sparkles, Film, Tv, Flame } from "lucide-react";

function MainComponent() {
  const [filtro, setFiltro] = useState("all");
  const [destacadosConNotas, setDestacadosConNotas] = useState(destacados);

  useEffect(() => {
    let isMounted = true;

    const cargarNotas = async () => {
      const items = await Promise.all(
        destacados.map(async (item) => {
          const rating = await fetchMediaImdbRating(item.id, item.type);
          return { ...item, rating };
        })
      );

      if (isMounted) {
        setDestacadosConNotas(items);
      }
    };

    cargarNotas();

    return () => {
      isMounted = false;
    };
  }, []);

  const elementosFiltrados = destacadosConNotas.filter((item) => {
    if (filtro === "movie") return item.type === "movie";
    if (filtro === "tv") return item.type === "tv";
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Banner / Introducción */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#121927] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calificaciones Reales & Streaming</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Descubre las mejores historias con puntuaciones de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
              IMDb
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Consulta mapas térmicos de calificaciones capítulo por capítulo, descubre en qué plataforma de streaming verlas y guarda tus favoritos.
          </p>
        </div>
      </section>

      {/* Barra de Filtros y Encabezado de Catálogo */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Títulos Destacados
            </h2>
            <span className="text-xs bg-gray-800 text-gray-400 font-bold px-2 py-0.5 rounded-full border border-white/5">
              {elementosFiltrados.length}
            </span>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-900/90 rounded-xl border border-white/10 shadow-inner self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFiltro("all")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filtro === "all"
                  ? "bg-yellow-400 text-gray-950 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro("tv")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filtro === "tv"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Series</span>
            </button>
            <button
              onClick={() => setFiltro("movie")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filtro === "movie"
                  ? "bg-amber-500 text-gray-950 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Películas</span>
            </button>
          </div>
        </div>

        {/* Grilla de Películas y Series */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3.5 sm:gap-5">
          {elementosFiltrados.map((item) => (
            <MovieCard
              key={`${item.type}-${item.id}`}
              id={item.id}
              title={item.title}
              image={item.image}
              type={item.type}
              rating={item.rating}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default MainComponent;
