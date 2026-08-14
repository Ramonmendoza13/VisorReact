import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import config from "../config/config";
import { User, Mail, Lock, UserPlus, AlertCircle, Film } from "lucide-react";

export default function Registro() {
  const { token, login, user } = useAuth();
  const [name, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${config.API_VISOR_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.user, data.token);
      } else {
        setErrorMsg(
          data.mensaje ||
            (data.errores ? Object.values(data.errores).flat().join(" ") : "Error al registrarse.")
        );
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrorMsg("Error de conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (token && user) {
    return <Navigate to="/zonaPrivada" />;
  }

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-gray-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Encabezado */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-gray-950 flex items-center justify-center mx-auto shadow-lg shadow-yellow-400/20 mb-3">
            <Film className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Crear Cuenta
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Únete a VISOR y guarda tus series y películas favoritas
          </p>
        </div>

        {/* Mensaje de error */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-300 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-white/10 focus:border-yellow-400/80 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-white/10 focus:border-yellow-400/80 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-white/10 focus:border-yellow-400/80 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-gray-950 font-black py-3 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-yellow-400 hover:underline font-bold transition ml-1"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}