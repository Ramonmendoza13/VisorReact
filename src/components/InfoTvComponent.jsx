import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaNotasEpisodios from "./TablaNotasEpisodios";
import WatchProvidersComponent from "./WatchProvidersComponent";
import config from "../config/config";
import getNotaColor from "../utils/notaColors";
import loadingGif from "../assets/loading.gif";
import { fetchSeriesImdbId, fetchImdbRating } from "../utils/imdb";
import { Bookmark, BookmarkCheck, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function InfoTvComponent({ title, id }) {
  const [resultados, setResultados] = useState(null);
  const [nota, setNota] = useState(null);
  const [seriesImdbId, setSeriesImdbId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [mostrarSinopsis, setMostrarSinopsis] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`${config.API_BASE_URL}/tv/${id}`, {
          params: {
            api_key: config.API_KEY,
            language: config.LANGUAGE,
          },
        });
        const tvData = response.data;
        setResultados(tvData);

        const imdbId = await fetchSeriesImdbId(id);
        setSeriesImdbId(imdbId);

        if (imdbId) {
          const ratingImdb = await fetchImdbRating(imdbId);
          if (ratingImdb !== null) {
            setNota(ratingImdb);
          } else if (tvData.vote_average) {
            setNota(parseFloat(tvData.vote_average.toFixed(1)));
          }
        } else if (tvData.vote_average) {
          setNota(parseFloat(tvData.vote_average.toFixed(1)));
        }
      } catch (error) {
        console.error("Error al obtener información de la serie:", error);
      } finally {
        setCargando(false);
      }
    };
    buscar();
  }, [id]);

  useEffect(() => {
    if (!token) return;

    const verificarGuardado = async () => {
      try {
        const response = await axios.get(
          `${config.API_VISOR_URL}/watchlists/tv/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setGuardado(true);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setGuardado(false);
        } else {
          console.error("Error al verificar watchlist:", error);
        }
      }
    };

    verificarGuardado();
  }, [id, token]);

  const formatearFechas = (inicio, fin) => {
    if (!inicio) return "";
    const añoInicio = new Date(inicio).getFullYear();
    const añoFin = fin ? new Date(fin).getFullYear() : "Presente";
    return `${añoInicio} - ${añoFin}`;
  };

  const anadir = async () => {
    try {
      const response = await axios.post(
        `${config.API_VISOR_URL}/watchlists`,
        {
          imdb_id: id,
          title: title,
          poster_path: resultados.poster_path,
          media_type: "tv",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setGuardado(true);
      }
    } catch (error) {
      console.error("Error al añadir serie:", error);
    }
  };

  const eliminar = async () => {
    try {
      const response = await axios.delete(
        `${config.API_VISOR_URL}/watchlists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setGuardado(false);
      }
    } catch (error) {
      console.error("Error al eliminar serie:", error);
    }
  };

  const handleClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (guardado) {
      eliminar();
    } else {
      anadir();
    }
  };

  if (cargando || !resultados) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img
          src={loadingGif}
          alt="Cargando..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-300 text-lg font-medium">
          Cargando detalles de la serie...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-6 space-y-3 sm:space-y-4">
      
      {/* 1º CABECERA COMPACTA DE LA SERIE: Póster al lado de la info en móvil y desktop */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-xl">
        {/* Backdrop sutil */}
        {resultados.backdrop_path && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={`${config.IMAGE_BASE_URL}/original${resultados.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover opacity-15 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/95 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-3 sm:p-5 flex flex-row gap-3 sm:gap-5 items-start">
          {/* Póster siempre al lado (no arriba) */}
          <div className="w-20 sm:w-28 lg:w-32 flex-shrink-0 rounded-xl overflow-hidden shadow-xl border border-white/10 bg-gray-950">
            <img
              src={`${config.IMAGE_BASE_URL}/w500${resultados.poster_path}`}
              alt={resultados.name}
              className="w-full h-auto object-cover aspect-[2/3]"
              onError={(e) => {
                e.target.src = config.PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          {/* Info Principal + Dónde Ver integrado al lado */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-1.5 py-0.2 rounded shadow">
                    Serie
                  </span>
                  {resultados.first_air_date && (
                    <span className="text-[11px] sm:text-xs text-gray-400 font-semibold">
                      {formatearFechas(resultados.first_air_date, resultados.last_air_date)}
                    </span>
                  )}
                </div>

                <h1 className="text-base sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight truncate sm:whitespace-normal">
                  {resultados.name}
                </h1>
              </div>

              {/* Botón Favorito */}
              <button
                onClick={handleClick}
                className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-xs transition-all duration-200 flex-shrink-0 shadow-md ${
                  guardado
                    ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                    : "bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-white/10 hover:border-yellow-400/40"
                }`}
              >
                {guardado ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-green-400" />
                    <span className="hidden sm:inline">Guardada</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                    <span className="hidden sm:inline">Guardar</span>
                  </>
                )}
              </button>
            </div>

            {/* Badges de Calificación y Temporadas */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 bg-gray-950/85 border border-yellow-400/30 px-2 py-0.5 rounded-lg shadow">
                <span className="bg-yellow-400 text-gray-950 font-black text-[9px] sm:text-[10px] px-1 py-0.2 rounded">
                  IMDb
                </span>
                <span className={`text-xs sm:text-sm font-black px-1 py-0.2 rounded text-white ${getNotaColor(nota)}`}>
                  {nota !== null ? nota.toFixed(1) : "N/A"}
                </span>
                <span className="text-[10px] text-gray-400">/ 10</span>
              </div>

              {resultados.number_of_seasons > 0 && (
                <div className="flex items-center gap-1 bg-gray-800/80 border border-white/10 px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-semibold text-gray-300">
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>{resultados.number_of_seasons} Temporadas</span>
                </div>
              )}
            </div>

            {/* 2º DÓNDE VER: EN FORMATO COMPACTO DIRECTO */}
            <WatchProvidersComponent type="tv" id={id} compact={true} />
          </div>
        </div>
      </div>

      {/* 3º LA MATRIZ DE PUNTUACIONES EN POSICIÓN PROTAGONISTA */}
      <TablaNotasEpisodios
        tvId={resultados.id}
        seriesImdbId={seriesImdbId}
        totalTemporadas={resultados.number_of_seasons}
      />

      {/* 4º SINOPSIS Y DETALLES EXTENDIDOS (COLAPSABLE / SECUNDARIO) */}
      {resultados.overview && (
        <div className="bg-gray-900/70 border border-white/5 rounded-2xl p-3.5 transition">
          <button
            onClick={() => setMostrarSinopsis(!mostrarSinopsis)}
            className="flex items-center justify-between w-full text-left text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition"
          >
            <span>Sinopsis de la Serie</span>
            {mostrarSinopsis ? (
              <ChevronUp className="w-4 h-4 text-yellow-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {mostrarSinopsis && (
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-2 pt-2 border-t border-white/5 text-justify animate-in fade-in duration-200">
              {resultados.overview}
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default InfoTvComponent;