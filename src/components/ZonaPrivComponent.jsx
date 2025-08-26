import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import MovieCard from './MovieCard.jsx'
import config from "../config/config";

function ZonaPrivComponent() {
    const { token, user, logout } = useAuth()
    const [WatchList, setWatchList] = useState([]);
    const [cargando, setCargando] = useState(true);

    if (!token) {
        return <Navigate to="/login" />
    }

    useEffect(() => {
        const fetchWatchList = async () => {
            try {
                setCargando(true);

                const response = await fetch(`${config.API_VISOR_URL}/watchlists`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener la lista de seguimiento');
                }

                const data = await response.json();

                if (data.watchlists && data.watchlists.length > 0) {
                    const watchlistPromises = data.watchlists.map(async (item) => {
                        try {
                            const movieResponse = await fetch(
                                `${config.API_BASE_URL}/${item.media_type}/${item.imdb_id}?api_key=${config.API_KEY}&language=${config.LANGUAGE}`
                            );

                            if (!movieResponse.ok) {
                                console.error(`Error al obtener ${item.imdb_id}`);
                                return null;
                            }

                            const movieData = await movieResponse.json();
                            return { ...item, ...movieData };
                        } catch (error) {
                            console.error(`Error procesando ${item.imdb_id}:`, error);
                            return null;
                        }
                    });

                    const watchlistWithDetails = await Promise.all(watchlistPromises);
                    const validWatchlist = watchlistWithDetails.filter(item => item !== null);
                    setWatchList(validWatchlist);
                } else {
                    setWatchList([]);
                }

            } catch (error) {
                console.error('Error general:', error);
                setWatchList([]);
            } finally {
                setCargando(false);
            }
        };

        fetchWatchList();
    }, [token]);

    const handleLogout = () => {
        logout();
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-center">
                    <div className="w-16 h-16 mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p>Cargando tu lista...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 flex justify-between items-center border border-gray-700">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold text-yellow-400">Zona Privada</h2>
                        <p><strong>Nombre:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Cerrar sesión
                    </button>
                </div>

                {/* Lista de seguimiento */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-yellow-400">Tu lista de seguimiento ({WatchList.length})</h3>
                    
                    {WatchList.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {WatchList.map(item => (
                                <MovieCard
                                    key={item.imdb_id}
                                    id={item.id}
                                    title={item.title || item.name}
                                    image={`${config.IMAGE_BASE_URL}/w500${item.poster_path}`}
                                    type={item.media_type}
                                    rating={item.vote_average}
                                    year={item.release_date ? new Date(item.release_date).getFullYear() : 
                                          item.first_air_date ? new Date(item.first_air_date).getFullYear() : null}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No tienes elementos en tu lista de seguimiento.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ZonaPrivComponent