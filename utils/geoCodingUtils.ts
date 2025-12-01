/**
 * Utilidades de Geocodificación usando Nominatim (OpenStreetMap)
 * 100% GRATIS - Sin API key necesaria
 * Convierte coordenadas a direcciones legibles
 */

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

/**
 * Obtiene la dirección desde coordenadas usando Nominatim (OpenStreetMap)
 * GRATIS - Sin límites estrictos (1 req/segundo recomendado)
 * 
 * @param coordinates - Latitud y longitud
 * @returns Dirección formateada
 */
export const reverseGeocode = async (
  coordinates: Coordinates
): Promise<string> => {
  try {
    const { latitude, longitude } = coordinates;
    
    // Nominatim (OpenStreetMap) - 100% GRATIS
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SIRSE-App/1.0' // Requerido por Nominatim
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data: NominatimResponse = await response.json();
    
    // Construir dirección en español
    if (data.address) {
      const parts = [];
      
      if (data.address.road) {
        parts.push(data.address.road);
        if (data.address.house_number) {
          parts[0] += ` ${data.address.house_number}`;
        }
      }
      
      if (data.address.neighbourhood || data.address.suburb) {
        parts.push(data.address.neighbourhood || data.address.suburb);
      }
      
      if (data.address.city) {
        parts.push(data.address.city);
      }
      
      if (data.address.state) {
        parts.push(data.address.state);
      }
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback a display_name completo
    if (data.display_name) {
      return data.display_name;
    }
    
    // Último fallback: coordenadas
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
  }
};

/**
 * Obtiene una dirección corta (calle y colonia/barrio)
 */
export const getShortAddress = async (
  coordinates: Coordinates
): Promise<string> => {
  try {
    const { latitude, longitude } = coordinates;
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SIRSE-App/1.0'
      }
    });
    
    const data: NominatimResponse = await response.json();
    
    if (data.address) {
      const parts = [];
      
      // Calle + número
      if (data.address.road) {
        let street = data.address.road;
        if (data.address.house_number) {
          street += ` ${data.address.house_number}`;
        }
        parts.push(street);
      }
      
      // Colonia/barrio
      if (data.address.neighbourhood || data.address.suburb) {
        parts.push(data.address.neighbourhood || data.address.suburb);
      }
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
  } catch (error) {
    console.error('Error obteniendo dirección corta:', error);
    return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
  }
};

/**
 * Cache de direcciones para evitar llamadas repetidas
 * y respetar el límite de 1 req/segundo de Nominatim
 */
const addressCache = new Map<string, string>();
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre peticiones

/**
 * Espera el tiempo necesario para respetar rate limit
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

/**
 * Versión con caché y rate limiting para mejor rendimiento
 * RECOMENDADO: Usa esta función en lugar de reverseGeocode directa
 */
export const reverseGeocodeWithCache = async (
  coordinates: Coordinates
): Promise<string> => {
  const key = `${coordinates.latitude.toFixed(6)},${coordinates.longitude.toFixed(6)}`;
  
  // Verificar caché
  if (addressCache.has(key)) {
    return addressCache.get(key)!;
  }
  
  // Respetar rate limit (1 req/segundo)
  await waitForRateLimit();
  
  // Obtener dirección
  const address = await reverseGeocode(coordinates);
  
  // Guardar en caché
  addressCache.set(key, address);
  
  return address;
};

/**
 * Limpiar caché (útil si la app ha estado abierta mucho tiempo)
 */
export const clearAddressCache = (): void => {
  addressCache.clear();
};