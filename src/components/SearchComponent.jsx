
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import config from "../config/config"; // Importamos la configuración

function SearchComponent({ searchTerm }) {
    // Estado para los resultados de la búsqueda
    const [resultados, setResultados] = useState([]);
    // Estado para controlar el loading
    const [loading, setLoading] = useState(false);

    // Buscar en la API cuando cambie el término de búsqueda
    useEffect(() => {
        const buscar = async () => {
            if (!searchTerm) {
                setResultados([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`${config.API_BASE_URL}/search/multi`, {
                    params: {
                        api_key: config.API_KEY,
                        query: searchTerm,
                        language: config.LANGUAGE,
                    },
                });
                setResultados(response.data.results);
            } catch (error) {
                console.error('Error al buscar:', error);
                setResultados([]);
            } finally {
                setLoading(false);
            }
        };
        
        buscar();
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="p-6 mx-auto" style={{ maxWidth: '1200px' }}>
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Buscando: <span className="text-yellow-400">{searchTerm}</span>
                </h1>
                <div className="flex flex-col items-center justify-center py-8">
                    <img 
                        src="/loading.gif" 
                        alt="Cargando..."
                        className="w-16 h-16 mb-4"
                    />
                    <p className="text-white text-lg">Buscando películas y series...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 mx-auto" style={{ maxWidth: '1200px' }}>
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Resultados de búsqueda para: <span className="text-yellow-400">{searchTerm}</span>
            </h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {resultados.map((item) => (
                    <MovieCard 
                        key={item.id} 
                        id={item.id} 
                        title={item.title || item.name} 
                        image={`${config.IMAGE_BASE_URL}/original${item.poster_path}`} 
                        type={item.media_type} 
                    />
                ))}
            </div>
            
            {resultados.length === 0 && searchTerm && !loading && (
                <div className="text-center text-white text-xl mt-8">
                    No se encontraron resultados para "{searchTerm}"
                </div>
            )}
        </div>
    );
}

export default SearchComponent