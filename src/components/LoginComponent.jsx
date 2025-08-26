import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // importar el hook
import { Navigate } from "react-router-dom";
import config from "../config/config"; // Importamos la configuración

export default function Login() {
    const { token, login, user } = useAuth();  // usar el hook para obtener token, login y user
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [respuesta, setRespuesta] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${config.API_VISOR_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setRespuesta(JSON.stringify(data));

            if (res.ok && data.token) {
                login(data.user, data.token); // guardas usuario y token juntos
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setRespuesta("Error al conectar con la API: " + error.message);
        }
    };


    if (token && user) {
        return (
            <Navigate to="/zonaPrivada" />
        );
    }


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                    >
                        Entrar
                    </button>
                </form>

                {respuesta && (
                    <div className="mt-4 p-3 bg-gray-50 border rounded">
                        <h3 className="font-semibold mb-1">Respuesta de la API:</h3>
                        <pre className="text-sm text-gray-700">{respuesta}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
