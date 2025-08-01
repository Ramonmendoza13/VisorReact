// Configuración de la aplicación
// Centraliza todas las constantes y configuraciones

const config = {
  // API de The Movie Database
  API_KEY: import.meta.env.VITE_API_KEY || "e9edaa4ea93296612b734f715a494df4",
  API_BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  
  // Configuración de idioma
  LANGUAGE: "es-ES",
  
  // URLs de placeholder para imágenes
  PLACEHOLDER_IMAGE: "https://via.placeholder.com/500x750/374151/FFFFFF?text=Sin+Imagen"
};

export default config;
