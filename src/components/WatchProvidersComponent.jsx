import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import { normalizeProviders } from "../utils/providers";
import { Tv } from "lucide-react";

function WatchProvidersComponent({ type, id, compact = false }) {
  const [providers, setProviders] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProviders = async () => {
      if (!id || !type) return;
      setCargando(true);

      try {
        const response = await axios.get(`${config.API_BASE_URL}/${type}/${id}/watch/providers`, {
          params: {
            api_key: config.API_KEY,
          },
        });

        if (isMounted) {
          const normalized = normalizeProviders(response.data);
          setProviders(normalized);
        }
      } catch (error) {
        console.error("Error al obtener plataformas de streaming:", error);
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    fetchProviders();

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  if (cargando) {
    return (
      <div className="bg-gray-900/60 p-2.5 rounded-xl border border-white/5 animate-pulse text-gray-400 text-xs flex items-center gap-2">
        <Tv className="w-3.5 h-3.5 text-gray-500" />
        <span>Consultando plataformas...</span>
      </div>
    );
  }

  const hasFlatrate = providers?.flatrate && providers.flatrate.length > 0;
  const hasRent = providers?.rent && providers.rent.length > 0;
  const hasBuy = providers?.buy && providers.buy.length > 0;
  const hasAny = hasFlatrate || hasRent || hasBuy;

  if (!hasAny) {
    if (compact) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 italic bg-gray-950/40 px-3 py-1.5 rounded-xl border border-white/5">
          <Tv className="w-3.5 h-3.5 text-gray-600" />
          <span>No disponible en streaming en España actualmente</span>
        </div>
      );
    }
    return (
      <div className="bg-gray-900/80 p-3 rounded-xl border border-white/5 text-gray-400 text-xs italic flex items-center gap-2">
        <Tv className="w-4 h-4 text-gray-500" />
        <span>No disponible en plataformas de streaming en España actualmente.</span>
      </div>
    );
  }

  // Vista compacta (para integrar arriba de la tabla o en cabecera)
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 bg-gray-950/80 border border-white/10 px-3 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold pr-1 border-r border-white/10 mr-1">
          <Tv className="w-3.5 h-3.5" />
          <span>Dónde ver:</span>
        </div>

        {/* Flatrate / Streaming */}
        {hasFlatrate && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {providers.flatrate.map((p) => (
              <div
                key={p.provider_id}
                className="flex items-center gap-1 bg-gray-900 border border-white/10 hover:border-yellow-400/40 px-2 py-0.5 rounded-lg shadow-sm transition"
                title={`Streaming: ${p.provider_name}`}
              >
                {p.logo_path ? (
                  <img
                    src={`${config.IMAGE_BASE_URL}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-4 h-4 rounded object-cover"
                  />
                ) : (
                  <span className="text-xs">📺</span>
                )}
                <span className="text-[11px] text-gray-200 font-medium">
                  {p.provider_name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Alquiler / Compra si no hay flatrate */}
        {!hasFlatrate && (hasRent || hasBuy) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from(
              new Map(
                [...(providers.rent || []), ...(providers.buy || [])].map((item) => [
                  item.provider_id,
                  item,
                ])
              ).values()
            ).slice(0, 4).map((p) => (
              <div
                key={p.provider_id}
                className="flex items-center gap-1 bg-gray-900/80 border border-white/5 px-2 py-0.5 rounded-lg text-[11px] text-gray-300"
                title={`Alquiler/Compra: ${p.provider_name}`}
              >
                {p.logo_path && (
                  <img
                    src={`${config.IMAGE_BASE_URL}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-3.5 h-3.5 rounded object-cover"
                  />
                )}
                <span>{p.provider_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vista estándar más limpia y compacta
  return (
    <div className="bg-gray-900/80 p-3.5 sm:p-4 rounded-2xl border border-white/10 space-y-2.5">
      <div className="flex items-center gap-2">
        <Tv className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm sm:text-base font-bold text-white">
          Dónde ver en España
        </h3>
      </div>

      <div className="space-y-2">
        {/* Streaming */}
        {hasFlatrate && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-green-400 mr-1">
              Suscripción:
            </span>
            {providers.flatrate.map((p) => (
              <div
                key={p.provider_id}
                className="flex items-center gap-1.5 bg-gray-950 border border-white/10 hover:border-yellow-400/40 px-2.5 py-1 rounded-lg shadow-sm transition"
                title={p.provider_name}
              >
                {p.logo_path && (
                  <img
                    src={`${config.IMAGE_BASE_URL}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-4 h-4 rounded object-cover"
                  />
                )}
                <span className="text-xs text-gray-200 font-medium">
                  {p.provider_name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Alquiler / Compra */}
        {(hasRent || hasBuy) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 mr-1">
              Alquiler/Compra:
            </span>
            {Array.from(
              new Map(
                [...(providers.rent || []), ...(providers.buy || [])].map((item) => [
                  item.provider_id,
                  item,
                ])
              ).values()
            ).slice(0, 5).map((p) => (
              <div
                key={p.provider_id}
                className="flex items-center gap-1.5 bg-gray-950/70 border border-white/5 px-2 py-0.5 rounded-lg text-xs text-gray-300"
                title={p.provider_name}
              >
                {p.logo_path && (
                  <img
                    src={`${config.IMAGE_BASE_URL}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-3.5 h-3.5 rounded object-cover"
                  />
                )}
                <span className="text-[11px]">{p.provider_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchProvidersComponent;
