import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import config from "../config/config";

export default function Registro() {
    const { token, login, user } = useAuth();
    const [name, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${config.API_VISOR_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            setRespuesta(data); // ← Cambiar: guardar el objeto, no el string

            if (res.ok && data.token) {
                login(data.user, data.token);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setRespuesta({ mensaje: "Error al conectar con la API: " + error.message }); // ← Cambiar también aquí
        } finally {
            setLoading(false);
        }
    };

    // ← Esto ya redirige automáticamente a zona privada si hay token
    if (token && user) {
        return <Navigate to="/zonaPrivada" />;
    }

    return (
        <div className="flex items-center justify-center bg-gray-900 py-12 px-4">

            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">                

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Registro</h2> {/* ← Cambio aquí */}
                    <p className="text-gray-400">Crea tu cuenta</p> {/* ← Cambio aquí */}
                </div>

                {respuesta && (
                    <div className="mt-6 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                        <h3 className="font-semibold mb-2 text-gray-300">Mensaje:</h3>
                        <p className="text-gray-400">{respuesta.mensaje}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registrando...
                            </>
                        ) : (
                            "Registrarse"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-medium transition"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>


            </div>
        </div>
    );
}