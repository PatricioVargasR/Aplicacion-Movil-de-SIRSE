import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface UseLocationReturn {
  location: LocationCoords | null;
  hasPermission: boolean;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

/**
 * Hook para obtener y gestionar la ubicación del usuario
 * 
 * @param requestOnMount - Si true, solicita permisos al montar el componente
 * @returns Objeto con ubicación, permisos, estado de carga y función para refrescar
 */
export const useLocation = (requestOnMount: boolean = true): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ubicación por defecto (Pachuca, Hidalgo)
  const DEFAULT_LOCATION: LocationCoords = {
    latitude: 20.0847,
    longitude: -98.3686,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    if (requestOnMount) {
      initializeLocation();
    } else {
      setLoading(false);
    }
  }, [requestOnMount]);

  /**
   * Inicializa la ubicación solicitando permisos
   */
  const initializeLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setHasPermission(false);
        setError('Permisos de ubicación denegados');
        
        // Intentar obtener última ubicación conocida
        await getLastKnownLocation();
        return;
      }

      setHasPermission(true);
      await getCurrentLocation();
    } catch (err) {
      console.error('Error initializing location:', err);
      setError('Error al inicializar ubicación');
      setLocation(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene la ubicación actual del usuario
   */
  const getCurrentLocation = async () => {
    try {
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setLocation(coords);
      setError(null);
    } catch (err) {
      console.error('Error getting current location:', err);
      await getLastKnownLocation();
    }
  };

  /**
   * Obtiene la última ubicación conocida
   */
  const getLastKnownLocation = async () => {
    try {
      const lastLocation = await Location.getLastKnownPositionAsync();

      if (lastLocation) {
        const coords: LocationCoords = {
          latitude: lastLocation.coords.latitude,
          longitude: lastLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setLocation(coords);
      } else {
        setLocation(DEFAULT_LOCATION);
      }
    } catch (err) {
      console.error('Error getting last known location:', err);
      setLocation(DEFAULT_LOCATION);
    }
  };

  /**
   * Refresca la ubicación del usuario
   */
  const refreshLocation = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Ubicación desactivada',
        'Por favor, activa los permisos de ubicación en la configuración de tu dispositivo.'
      );
      return;
    }

    setLoading(true);
    await getCurrentLocation();
    setLoading(false);
  };

  return {
    location,
    hasPermission,
    loading,
    error,
    refreshLocation,
  };
};