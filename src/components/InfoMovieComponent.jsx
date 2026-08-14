import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import getNotaColor from "../utils/notaColors";
import { fetchImdbRating } from "../utils/imdb";
import WatchProvidersComponent from "./WatchProvidersComponent";
import { Bookmark, BookmarkCheck, Star, Clock, Calendar, Film } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function InfoMovieComponent({ title, id }) {
  const [resultados, setResultados] = useState(null);
  const [nota, setNota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { token } = useAuth();
  const [guardado, setGuardado] = useState(false);
  const navigate = useNavigate();

  // Buscar la película en TMDB y obtener la nota de IMDb
  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`${config.API_BASE_URL}/movie/${id}`, {
          params: {
            api_key: config.API_KEY,
            language: config.LANGUAGE,
          },
        });
        const movieData = response.data;
        setResultados(movieData);

        if (movieData.imdb_id) {
          const ratingImdb = await fetchImdbRating(movieData.imdb_id);
          if (ratingImdb !== null) {
            setNota(ratingImdb);
          } else if (movieData.vote_average) {
            setNota(parseFloat(movieData.vote_average.toFixed(1)));
          }
        } else if (movieData.vote_average) {
          setNota(parseFloat(movieData.vote_average.toFixed(1)));
        }
      } catch (error) {
        console.error("Error al obtener información de la película:", error);
      } finally {
        setCargando(false);
      }
    };
    buscar();
  }, [id]);

  // Verificar si está en la WatchList
  useEffect(() => {
    if (!token) return;

    const verificarGuardado = async () => {
      try {
        const response = await axios.get(
          `${config.API_VISOR_URL}/watchlists/movie/${id}`,
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

  const formatearAño = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).getFullYear();
  };

  const anadir = async () => {
    try {
      const response = await axios.post(
        `${config.API_VISOR_URL}/watchlists`,
        {
          imdb_id: id,
          title: title,
          poster_path: resultados.poster_path,
          media_type: "movie",
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
      console.error("Error al añadir película:", error);
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
      console.error("Error al eliminar película:", error);
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
          src="/loading.gif"
          alt="Cargando..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-300 text-lg font-medium">
          Cargando detalles de la película...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Principal con Fondo Cinemático */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
        {/* Imagen de fondo difuminada */}
        {resultados.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={`${config.IMAGE_BASE_URL}/original${resultados.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-3.5 sm:p-8 lg:p-10 flex flex-row gap-3.5 sm:gap-8 lg:gap-10 items-start">
          {/* Póster */}
          <div className="w-24 sm:w-56 lg:w-64 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-950">
            <img
              src={`${config.IMAGE_BASE_URL}/w500${resultados.poster_path}`}
              alt={resultados.title}
              className="w-full h-auto object-cover aspect-[2/3]"
              onError={(e) => {
                e.target.src = config.PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4 lg:space-y-6 w-full">
            {/* Título + Botón Guardar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-gray-950 px-2 py-0.5 rounded">
                    Película
                  </span>
                  {resultados.release_date && (
                    <span className="text-xs text-gray-400 font-semibold">
                      {formatearAño(resultados.release_date)}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {resultados.title}
                </h1>

                {resultados.tagline && (
                  <p className="text-sm sm:text-base text-gray-400 italic mt-1 font-light">
                    "{resultados.tagline}"
                  </p>
                )}
              </div>

              {/* Botón Favorito */}
              <button
                onClick={handleClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 self-start shadow-md ${
                  guardado
                    ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                    : "bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-white/10 hover:border-yellow-400/40"
                }`}
              >
                {guardado ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-green-400" />
                    <span>En tu Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-gray-400" />
                    <span>Guardar en Watchlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Badges de Calificación y Metadatos */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Badge IMDb */}
              <div className="flex items-center gap-2 bg-gray-950/80 border border-yellow-400/30 px-3 py-1.5 rounded-xl shadow-lg">
                <span className="bg-yellow-400 text-gray-950 font-black text-xs px-1.5 py-0.5 rounded">
                  IMDb
                </span>
                <span className={`text-base font-black px-2 py-0.5 rounded-lg text-white ${getNotaColor(nota)}`}>
                  {nota !== null ? nota.toFixed(1) : "N/A"}
                </span>
                <span className="text-xs text-gray-400">/ 10</span>
              </div>

              {/* Duración */}
              {resultados.runtime > 0 && (
                <div className="flex items-center gap-1.5 bg-gray-800/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{resultados.runtime} min</span>
                </div>
              )}

              {/* Géneros */}
              {resultados.genres &&
                resultados.genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-gray-800/60 border border-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {g.name}
                  </span>
                ))}
            </div>

            {/* Sinopsis */}
            <div className="bg-gray-950/70 border border-white/5 p-4 sm:p-5 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Sinopsis
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
                {resultados.overview || "No hay descripción disponible para esta película."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plataformas de Streaming */}
      <WatchProvidersComponent type="movie" id={id} />
    </div>
  );
}

export default InfoMovieComponent;
