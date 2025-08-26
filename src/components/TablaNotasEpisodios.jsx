import axios from "axios";
import { useState, useEffect, use } from "react";
import getNotaColor from "../utils/notaColors"; // Importamos la función para obtener el color de la nota
import config from "../config/config"; // Importamos la configuración
import loadingGif from '../assets/loading.gif'; // ← Ruta correcta desde src/assets


function TablaNotasEpisodios({ tvId, totalTemporadas }) {

  // Variable para añadir las temporadas con la nota de cada capitulo
  const [temporadasConNotas, setTemporadasConNotas] = useState([]);
  // Estado para el loading
  const [cargando, setCargando] = useState(true);

  //Consulta a la API para obtener las notas de los episodios
  useEffect(() => {
    const obtenerNotas = async () => {
      if (!tvId || !totalTemporadas) return;
      
      setCargando(true);
      const temporadas = []; // Array para almacenar las temporadas y sus episodios
      // Recorremos cada temporada para obtener sus episodios
      for (let i = 1; i <= totalTemporadas; i++) {
        const response = await axios.get(`${config.API_BASE_URL}/tv/${tvId}/season/${i}`, {
          params: {
            api_key: config.API_KEY,
            language: config.LANGUAGE
          }
        });
        const episodios = response.data.episodes.map(episodio => ({ // Mapeamos los episodios a un formato más simple
          capitulo: episodio.episode_number,
          nota: episodio.air_date && new Date(episodio.air_date) <= new Date()
            ? parseFloat(episodio.vote_average.toFixed(1))
            : null, // null para episodios no lanzados
        }));
        // Añadimos la temporada y sus episodios al array
        temporadas.push({
          temporada: i,
          episodios: episodios
        });
      }
      setTemporadasConNotas(temporadas); // Actualizamos el estado con las temporadas obtenidas
      setCargando(false);
    };
    obtenerNotas();
  }, [tvId, totalTemporadas]);


  // Mostrar loading mientras cargan las temporadas
  if (cargando) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-8">
        <img 
          src={loadingGif} 
          alt="Cargando..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-white text-lg">Cargando episodios por temporada...</p>
      </div>
    );
  }

  // Calcular el máximo número de episodios de todas las temporadas
  const maxEpisodios = temporadasConNotas.reduce((max, temporada) => {
    return Math.max(max, temporada.episodios.length);
  }, 0);

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <table className="border-separate border-spacing-1 min-w-full sm:min-w-0">
          <thead>
            <tr>
              <th ></th>
              {temporadasConNotas.map((temporada, i) => ( // Mapeamos las temporadas para crear las cabeceras
                // Añadimos una cabecera por cada temporada
                <th key={i}>T {temporada.temporada}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxEpisodios }, (_, episodio) => ( // Recorremos el número máximo de episodios
              // Creamos una fila por cada episodio
              <tr key={episodio + 1}>

                <th >{episodio + 1}</th>
                {temporadasConNotas.map((temporada, i) => ( // Mapeamos las temporadas para crear las celdas
                  // Añadimos una celda por cada episodio de cada temporada
                  <td key={i} className={`py-2 px-4 m-1 text-center rounded-lg min-w-[80px] ${getNotaColor(temporada.episodios.find(ep => ep.capitulo === episodio + 1)?.nota)}`}>
                    {temporada.episodios.find(ep => ep.capitulo === episodio + 1)?.nota ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TablaNotasEpisodios