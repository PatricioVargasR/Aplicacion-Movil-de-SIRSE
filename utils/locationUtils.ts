import { GeographicBounds } from '@/services/reportServices';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calcula los límites geográficos (bounding box) alrededor de un punto
 * 
 * @param center - Coordenadas del centro (ubicación del usuario)
 * @param radiusKm - Radio en kilómetros (por defecto 5km)
 * @returns Objeto con límites norte-este y sur-oeste
 */
export const calculateGeographicBounds = (
  center: Coordinates,
  radiusKm: number = 5
): GeographicBounds => {
  // Aproximación: 1 grado de latitud ≈ 111 km
  // 1 grado de longitud varía según la latitud
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(center.latitude * (Math.PI / 180)));

  return {
    northEast: {
      latitude: center.latitude + latDelta,
      longitude: center.longitude + lngDelta,
    },
    southWest: {
      latitude: center.latitude - latDelta,
      longitude: center.longitude - lngDelta,
    },
  };
};

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * 
 * @param point1 - Primera coordenada
 * @param point2 - Segunda coordenada
 * @returns Distancia en kilómetros
 */
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  const R = 6371; // Radio de la Tierra en km
  
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
    Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Formatea la distancia para mostrarla al usuario
 * 
 * @param distanceKm - Distancia en kilómetros
 * @returns String formateado (ej: "1.2 km" o "850 m")
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Convierte grados a radianes
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};