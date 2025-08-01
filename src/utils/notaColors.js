// Función para obtener el color de fondo según la nota con más variedad
const getNotaColor = (nota) => {
    if (nota >= 9) return "bg-green-900"; // Excelente - verde oscuro
    if (nota >= 8) return "bg-green-600"; // Muy buena - verde fuerte
    if (nota >= 7) return "bg-yellow-500"; // Regular - amarillo
    if (nota >= 5) return "bg-orange-500"; // Aceptable - naranja
    if (nota >= 4) return "bg-red-500"; // Mala - rojo
    if (nota >= 3) return "bg-pink-600"; // Muy mala - rosa
    if (nota < 3) return "bg-purple-600"; // Pésima - morado
    return ""; // Pésima - morado
};

export default getNotaColor;