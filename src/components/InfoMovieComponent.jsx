import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import { Bookmark, BookmarkCheck } from "lucide-react"; // Iconos
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function InfoMovieComponent({ title, id }) {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { token } = useAuth()

  // Estado para saber si está guardado
  const [guardado, setGuardado] = useState();

  const navigate = useNavigate();


  // Buscar la película en la API
  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      const response = await axios.get(`${config.API_BASE_URL}/movie/${id}`, {
        params: {
          api_key: config.API_KEY,
          language: config.LANGUAGE,
        },
      });
      setResultados(response.data);
      setCargando(false);
    };
    buscar();
  }, [id]);

  // Busca si la película está guardada en la WatchList de usuario
  if (token) {
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
            // No está en watchlist → estado falso
            setGuardado(false);
          } else {
            console.error("Error al verificar watchlist:", error);
          }
        }
      };

      verificarGuardado();
    }, [id, token]);


  }


  const getNotaColor = (nota) => {
    if (nota >= 9) return "bg-emerald-600";
    if (nota >= 8) return "bg-green-600";
    if (nota >= 7) return "bg-teal-500";
    if (nota >= 6) return "bg-yellow-500";
    if (nota >= 5) return "bg-orange-500";
    if (nota >= 4) return "bg-red-500";
    if (nota >= 3) return "bg-pink-600";
    return "bg-purple-600";
  };

  const formatearAño = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).getFullYear();
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-white text-lg">Cargando información de la película...</p>
      </div>
    );
  }

  // Funciones que quieres llamar
  const anadir = async () => {
    try {
      const response = await axios.post(
        `${config.API_VISOR_URL}/watchlists/`,
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
        console.log("Película añadida a guardados:", id);
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
        console.log("Película eliminada de guardados:", id);
        setGuardado(false);
      }
    } catch (error) {
      console.error("Error al eliminar película:", error);
    }
  };


  const redLogin = () => {
    navigate("/login");
  };

  const handleClick = () => {
    if (!token) {
      redLogin();
      return;
    }

    if (guardado) {
      eliminar();
    } else {
      anadir();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-2xl">
      <div className="flex flex-row gap-4 lg:gap-8">
        {/* Poster */}
        <div className="w-24 h-36 lg:w-1/3 lg:h-auto flex-shrink-0">
          <img
            src={`${config.IMAGE_BASE_URL}/w500${resultados.poster_path}`}
            alt={resultados.title}
            className="w-full h-full rounded-lg shadow-lg object-cover"
            onError={(e) => {
              e.target.src = config.PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3 lg:space-y-6">
          {/* Título + año + botón de guardar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4 justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
              <h1 className="text-xl lg:text-4xl font-bold text-yellow-400">
                {resultados.title}
              </h1>
              {resultados.release_date && (
                <span className="text-gray-300 text-sm lg:text-lg font-medium">
                  ({formatearAño(resultados.release_date)})
                </span>
              )}
            </div>

            {/* Icono guardado */}
            <button
              onClick={handleClick}
              className="p-2 rounded-full hover:bg-gray-800 transition"
              title={guardado ? "Quitar de guardados" : "Guardar"}
            >
              {guardado ? (
                <BookmarkCheck className="w-6 h-6 text-green-400" />
              ) : (
                <Bookmark className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>

          {/* Nota */}
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-gray-300 text-sm lg:text-lg">Calificación:</span>
            <span
              className={`px-2 lg:px-4 py-1 lg:py-2 rounded-full text-white font-bold text-sm lg:text-lg ${getNotaColor(
                resultados.vote_average
              )}`}
            >
              {resultados.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="text-gray-400 text-sm lg:text-lg">/10</span>
          </div>

          {/* Descripción */}
          <div className="bg-gray-800 p-3 lg:p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg lg:text-xl font-semibold text-yellow-400 mb-2 lg:mb-3">
              Descripción
            </h3>
            <p className="text-gray-300 leading-relaxed text-justify text-sm lg:text-base">
              {resultados.overview || "No hay descripción disponible."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoMovieComponent;
