import React from "react";
import { Film, Github, Linkedin, Globe } from "lucide-react";

function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070A0F] border-t border-white/5 text-gray-400 py-10 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo y lema */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-black text-white tracking-wider">VISOR</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Explora calificaciones reales de IMDb y descubre dónde ver tus películas y series favoritas.
            </p>
          </div>

          {/* Enlaces y créditos */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://www.linkedin.com/in/ram%C3%B3n-mendoza-candelario-8894252a9/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-yellow-400 border border-white/5 transition"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">LinkedIn</span>
            </a>

            <a
              href="https://github.com/ramonmendoza13"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-yellow-400 border border-white/5 transition"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">GitHub</span>
            </a>

            <a
              href="https://ramonmendoza13.github.io/Porfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-yellow-400 border border-white/5 transition"
              title="Portfolio"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Portfolio</span>
            </a>
          </div>

        </div>

        {/* Separador inferior */}
        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {currentYear} VISOR · Desarrollado por <span className="text-gray-300 font-semibold">Ramón Mendoza</span></p>
          <p className="flex items-center gap-2 text-[11px]">
            <span>Datos provistos por TMDB y OMDb API</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;