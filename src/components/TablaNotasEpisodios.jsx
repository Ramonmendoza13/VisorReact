import React, { useState, useEffect } from "react";
import axios from "axios";
import getNotaColor from "../utils/notaColors";
import config from "../config/config";
import loadingGif from "../assets/loading.gif";
import { fetchSeriesImdbId, fetchSeasonRatings } from "../utils/imdb";
import { Calendar, Clock, X } from "lucide-react";

function TablaNotasEpisodios({
  tvId,
  seriesImdbId,
  totalTemporadas,
}) {
  const [temporadasConNotas, setTemporadasConNotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para la tarjeta detallada (solo al hacer clic)
  const [episodioSeleccionado, setEpisodioSeleccionado] = useState(null);

  // Estado para el tooltip sutil en hover
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    nombre: "",
    fecha: "",
    votos: null,
    nota: null,
  });

  useEffect(() => {
    let isMounted = true;

    const obtenerNotas = async () => {
      if (!tvId || !totalTemporadas) return;

      setCargando(true);
      try {
        const imdbId = seriesImdbId || (await fetchSeriesImdbId(tvId));

        const seasonPromises = Array.from({ length: totalTemporadas }, async (_, index) => {
          const seasonNum = index + 1;
          try {
            const [tmdbRes, omdbSeasonMap] = await Promise.all([
              axios.get(`${config.API_BASE_URL}/tv/${tvId}/season/${seasonNum}`, {
                params: {
                  api_key: config.API_KEY,
                  language: config.LANGUAGE,
                },
              }),
              imdbId ? fetchSeasonRatings(imdbId, seasonNum) : Promise.resolve({}),
            ]);

            const episodios = (tmdbRes.data?.episodes || []).map((episodio) => {
              const epNum = episodio.episode_number;
              const isAired = episodio.air_date && new Date(episodio.air_date) <= new Date();
              let nota = null;

              if (isAired) {
                if (
                  omdbSeasonMap &&
                  omdbSeasonMap[epNum] !== undefined &&
                  omdbSeasonMap[epNum] !== null
                ) {
                  nota = omdbSeasonMap[epNum];
                } else if (episodio.vote_average) {
                  nota = parseFloat(episodio.vote_average.toFixed(1));
                }
              }

              return {
                temporada: seasonNum,
                capitulo: epNum,
                nombre: episodio.name || `Episodio ${epNum}`,
                fecha: episodio.air_date || "",
                votos: episodio.vote_count || null,
                duracion: episodio.runtime,
                sinopsis: episodio.overview,
                imagen: episodio.still_path,
                nota: nota,
              };
            });

            return {
              temporada: seasonNum,
              episodios: episodios,
            };
          } catch (seasonError) {
            console.error(`Error al cargar temporada ${seasonNum}:`, seasonError);
            return {
              temporada: seasonNum,
              episodios: [],
            };
          }
        });

        const temporadas = await Promise.all(seasonPromises);
        if (isMounted) {
          setTemporadasConNotas(temporadas);
        }
      } catch (error) {
        console.error("Error general al obtener notas de episodios:", error);
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    obtenerNotas();

    return () => {
      isMounted = false;
    };
  }, [tvId, seriesImdbId, totalTemporadas]);

  const formatearFechaLarga = (fechaStr) => {
    if (!fechaStr) return "Fecha no confirmada";
    try {
      const [year, month, day] = fechaStr.split("-");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  const handleMouseEnter = (epData, event) => {
    if (!epData) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      nombre: epData.nombre,
      fecha: epData.fecha,
      votos: epData.votos,
      nota: epData.nota,
    });
  };

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip((prev) => ({
      ...prev,
      x: rect.left + rect.width / 2,
      y: rect.top,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleCellClick = (epData) => {
    if (!epData) return;
    if (
      episodioSeleccionado?.temporada === epData.temporada &&
      episodioSeleccionado?.capitulo === epData.capitulo
    ) {
      setEpisodioSeleccionado(null);
    } else {
      setEpisodioSeleccionado(epData);
    }
  };

  if (cargando) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-12 bg-gray-900/60 rounded-2xl border border-white/5">
        <img
          src={loadingGif}
          alt="Cargando..."
          className="w-14 h-14 mb-3"
        />
        <p className="text-gray-300 text-sm font-medium">
          Cargando matriz de episodios y notas de IMDb...
        </p>
      </div>
    );
  }

  const maxEpisodios = temporadasConNotas.reduce((max, temporada) => {
    return Math.max(max, temporada.episodios.length);
  }, 0);

  if (temporadasConNotas.length === 0 || maxEpisodios === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Contenedor Principal de la Tabla */}
      <div className="bg-gray-900/90 border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl space-y-4">
        
        {/* Cabecera limpia de sección (sin duplicar póster, título ni nota que ya están en el header) */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-yellow-400">★</span> Matriz de Puntuaciones por Episodio
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              {totalTemporadas} {totalTemporadas === 1 ? "Temporada" : "Temporadas"} · {maxEpisodios} Episodios max · Calificaciones oficiales de IMDb
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-950 px-2.5 py-1 rounded-full border border-white/5 font-medium">
              💡 Clic para sinopsis · Hover para fecha y votos
            </span>
          </div>
        </div>

        {/* Ficha completa del capítulo al hacer CLIC */}
        {episodioSeleccionado && (
          <div className="bg-gray-950/95 border border-yellow-400/40 rounded-xl p-3.5 sm:p-5 shadow-2xl transition-all duration-200 relative animate-in fade-in">
            <button
              onClick={() => setEpisodioSeleccionado(null)}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              title="Cerrar ficha"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row gap-3.5 items-start pr-6">
              {episodioSeleccionado.imagen && (
                <div className="w-full md:w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-white/10">
                  <img
                    src={`${config.IMAGE_BASE_URL}/w500${episodioSeleccionado.imagen}`}
                    alt={episodioSeleccionado.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-gray-950 text-xs font-black px-2 py-0.5 rounded">
                      T{episodioSeleccionado.temporada} · E{episodioSeleccionado.capitulo}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {episodioSeleccionado.nombre}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Nota IMDb:</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-white font-black text-xs shadow ${getNotaColor(
                        episodioSeleccionado.nota
                      )}`}
                    >
                      {episodioSeleccionado.nota !== null && episodioSeleccionado.nota !== undefined
                        ? episodioSeleccionado.nota.toFixed(1)
                        : "Sin nota"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-yellow-400" />
                    <span>{formatearFechaLarga(episodioSeleccionado.fecha)}</span>
                  </div>

                  {episodioSeleccionado.duracion ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      <span>{episodioSeleccionado.duracion} min</span>
                    </div>
                  ) : null}
                </div>

                <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 pt-0.5">
                  {episodioSeleccionado.sinopsis || "No hay sinopsis disponible para este capítulo."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla Heatmap con Densidad Ajustada */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-950 rounded-xl bg-gray-950/80 p-2 sm:p-4 border border-white/5">
          <table className="border-separate border-spacing-1 sm:border-spacing-1.5 min-w-full sm:min-w-0 mx-auto">
            <thead>
              <tr>
                <th className="text-gray-400 text-[10px] sm:text-xs p-1 text-center font-bold uppercase tracking-wider">
                  Ep.
                </th>
                {temporadasConNotas.map((temporada, i) => (
                  <th
                    key={i}
                    className="text-yellow-400 text-xs sm:text-sm p-1 text-center font-black min-w-[38px] sm:min-w-[58px]"
                  >
                    T{temporada.temporada}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxEpisodios }, (_, episodioIdx) => {
                const epNumero = episodioIdx + 1;
                return (
                  <tr key={epNumero}>
                    <th className="text-gray-400 text-[10px] sm:text-xs p-0.5 sm:p-1 text-center font-bold">
                      {epNumero}
                    </th>
                    {temporadasConNotas.map((temporada, i) => {
                      const epData = temporada.episodios.find((ep) => ep.capitulo === epNumero);
                      const notaValor = epData?.nota;
                      const esSeleccionado =
                        episodioSeleccionado?.temporada === temporada.temporada &&
                        episodioSeleccionado?.capitulo === epNumero;

                      return (
                        <td
                          key={i}
                          onMouseEnter={(e) => handleMouseEnter(epData, e)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleCellClick(epData)}
                          className={`py-1 sm:py-1.5 px-1 sm:px-2 text-center text-[11px] sm:text-xs font-black text-white rounded-md transition-all duration-150 select-none ${
                            epData
                              ? `${getNotaColor(notaValor)} cursor-pointer hover:scale-110 hover:brightness-115 hover:shadow-md ${
                                  esSeleccionado
                                    ? "ring-2 ring-yellow-400 scale-105 z-10 brightness-115"
                                    : ""
                                }`
                              : "bg-transparent text-gray-800 cursor-default"
                          }`}
                        >
                          {notaValor !== null && notaValor !== undefined
                            ? notaValor.toFixed(1)
                            : epData
                            ? "-"
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leyenda de Colores Compacta */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-gray-400">
          <span className="font-semibold text-gray-300">Escala:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-green-900 inline-block" /> 9+ Excelente
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-green-600 inline-block" /> 8+ Muy buena
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block" /> 7+ Buena
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" /> 5+ Regular
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" /> &lt;5 Baja
          </span>
        </div>
      </div>

      {/* Tooltip sutil en hover */}
      {tooltip.visible && (
        <div
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 8}px`,
          }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full bg-[#1b222d] text-white border border-gray-700/80 rounded-lg px-3 py-1.5 shadow-2xl text-center min-w-[140px] max-w-[220px]"
        >
          <p className="font-bold text-xs text-gray-100 leading-tight">
            {tooltip.nombre}
          </p>

          {tooltip.fecha && (
            <p className="text-[10px] text-gray-300 italic mt-0.5">
              {tooltip.fecha}
            </p>
          )}

          {tooltip.votos !== null && tooltip.votos !== undefined && (
            <p className="text-[10px] text-gray-400 italic mt-0.5">
              {tooltip.votos.toLocaleString("es-ES")} votos
            </p>
          )}

          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-5 border-x-transparent border-t-5 border-t-[#1b222d]" />
        </div>
      )}
    </div>
  );
}

export default TablaNotasEpisodios;