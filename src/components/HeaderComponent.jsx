// Importo los componentes necesarios de react-router-dom y useState de React
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function HeaderComponent() {
    // Estado para guardar el texto introducido en el input
    const [titulo, setTitulo] = useState("");
    // Hook para navegar programáticamente entre rutas
    const navigate = useNavigate();

    // Función que se ejecuta al hacer clic en el botón Buscar
    // Si el input no está vacío, navega a la ruta /{titulo}
    const handleBuscar = () => {
        if (titulo.trim() !== "") {
            navigate(`/buscar/${encodeURIComponent(titulo)}`);
        }
    };

    return (
        // Header principal con fondo degradado y sombra
        <header className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 py-6 shadow-lg backdrop-blur-md">
            <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                {/* Sección izquierda: título y subtítulo */}
                <section className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                    {/* Título principal que redirige al inicio al hacer clic */}
                    <h1 id="visor" className="text-3xl font-extrabold text-yellow-300 tracking-wider drop-shadow-lg">
                        <Link to="/" className="hover:text-white transition">VISOR</Link>
                    </h1>
                    {/* Subtítulo descriptivo */}
                    <p className="text-gray-100 text-base md:text-lg italic">Puntuación de Series y Películas</p>
                </section>
                {/* Sección derecha: input de búsqueda y botón */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Input controlado para introducir el título */}
                    <input
                        type="text"
                        id="titulo"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)} // Actualiza el estado al escribir
                        placeholder="Introduce el título de una película o serie"
                        className="px-4 py-2 rounded-xl border-none bg-white/20 text-white placeholder-white placeholder-opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full md:w-80 shadow-inner backdrop-blur"
                    />
                    {/* Botón que ejecuta la búsqueda al hacer clic */}
                    <button
                        id="boton-buscar"
                        onClick={handleBuscar}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                    >
                        Buscar
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default HeaderComponent;
