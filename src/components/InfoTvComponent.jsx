import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaNotasEpisodios from "./TablaNotasEpisodios";
import getNotaColor from "../utils/notaColors"; // Importamos la función para obtener el color de la nota
import config from "../config/config"; // Importamos la configuración
import loadingGif from '../assets/loading.gif'; // ← Ruta correcta desde src/assets
import { Bookmark, BookmarkCheck } from "lucide-react"; // Iconos
import { useAuth } from '../context/AuthContext.jsx'


function InfoTvComponent({ title, id }) {

  //resultados de la búsqueda
  const [resultados, setResultados] = useState([]);
  // Estado para el loading
  const [cargando, setCargando] = useState(true);
  // Estado para saber si está guardado
  const [guardado, setGuardado] = useState();
  // 
  const { token } = useAuth()



  //Buscar el name el la API o en el estado global con AXIOS
  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      const response = await axios.get(`${config.API_BASE_URL}/tv/${id}`, {
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

  // Busca si la serie esta guardada en la WatchList de usuario
  // Busca si la película está guardada en la WatchList de usuario
  if (token) {
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

  // Función para formatear fechas en formato año
  const formatearFechas = (inicio, fin) => {
    if (!inicio || !fin) return "";
    const añoInicio = new Date(inicio).getFullYear();
    const añoFin = new Date(fin).getFullYear();
    return `${añoInicio} - ${añoFin}`;
  };

  // Mostrar loading mientras carga
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src={loadingGif}
          alt="Cargando..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-white text-lg">Cargando información de la serie...</p>
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
          media_type: "tv",
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
        {/* Imagen del poster - más pequeña en móvil */}
        <div className="w-24 h-36 lg:w-1/3 lg:h-auto flex-shrink-0">
          <img
            src={`${config.IMAGE_BASE_URL}/w500${resultados.poster_path}`}
            alt={resultados.name}
            className="w-full h-full rounded-lg shadow-lg object-cover"
            onError={(e) => {
              e.target.src = config.PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Información de la serie - a la derecha de la imagen */}
        <div className="flex-1 space-y-3 lg:space-y-6">
          {/* Título y fechas en la misma línea */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
            <h1 className="text-xl lg:text-4xl font-bold text-yellow-400">
              {resultados.name}
            </h1>

            {/* Fechas de inicio y fin al lado del título */}
            {resultados.first_air_date && resultados.last_air_date && (
              <span className="text-gray-300 text-sm lg:text-lg font-medium">
                ({formatearFechas(resultados.first_air_date, resultados.last_air_date)})
              </span>
            )}

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

          {/* Nota con color de fondo */}
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-gray-300 text-sm lg:text-lg">Calificación:</span>
            <span className={`px-2 lg:px-4 py-1 lg:py-2 rounded-full text-white font-bold text-sm lg:text-lg ${getNotaColor(resultados.vote_average)}`}>
              {resultados.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="text-gray-400 text-sm lg:text-lg">/10</span>
          </div>

          {/* Descripción */}
          <div className="bg-gray-800 p-3 lg:p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg lg:text-xl font-semibold text-yellow-400 mb-2 lg:mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed text-justify text-sm lg:text-base">
              {resultados.overview || 'No hay descripción disponible.'}
            </p>
          </div>
        </div>
      </div>
      <TablaNotasEpisodios tvId={resultados.id} totalTemporadas={resultados.number_of_seasons} />
    </div>
  )
}

export default InfoTvComponent