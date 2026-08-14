// Configuración de la aplicación
// Centraliza todas las constantes y configuraciones

const config = {
  // API de The Movie Database
  API_KEY: import.meta.env.VITE_API_KEY || "e9edaa4ea93296612b734f715a494df4",
  API_BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",

  API_VISOR_URL: "https://visorapi.onrender.com/api",

  // API de OMDb (calificaciones de IMDb)
  OMDB_API_KEY: import.meta.env.VITE_OMDB_API_KEY || "d7f53ca4",
  OMDB_BASE_URL: "https://www.omdbapi.com",

  // Configuración de región e idioma
  WATCH_REGION: import.meta.env.VITE_WATCH_REGION || "ES",
  LANGUAGE: "es-ES",
  
  // URLs de placeholder para imágenes
  PLACEHOLDER_IMAGE: "https://via.placeholder.com/500x750/374151/FFFFFF?text=Sin+Imagen"
};

export default config;
