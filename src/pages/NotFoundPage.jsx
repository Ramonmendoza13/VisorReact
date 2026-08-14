import { Link } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { Film, Home, ArrowLeft } from "lucide-react";

function NotFoundPage() {
  return (
    <>
      <HeaderComponent />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6 bg-gray-900/80 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Film className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              404
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Página no encontrada
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              El título o la sección que estás buscando no existe o fue trasladado.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}

export default NotFoundPage;