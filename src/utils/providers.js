import config from "../config/config";

export const pickProviderRegion = (results) => {
  if (!results) return { region: null, data: null };

  const preferred = [config.WATCH_REGION, "ES", "US"];
  for (const code of preferred) {
    if (results[code]) return { region: code, data: results[code] };
  }

  const fallbackKey = Object.keys(results)[0];
  return fallbackKey ? { region: fallbackKey, data: results[fallbackKey] } : { region: null, data: null };
};

export const normalizeProviders = (providerData) => {
  const { region, data } = pickProviderRegion(providerData?.results);
  return {
    region,
    flatrate: data?.flatrate || [],
    rent: data?.rent || [],
    buy: data?.buy || [],
    free: data?.free || [],
    ads: data?.ads || [],
  };
};
