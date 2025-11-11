import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ReportService } from '@/services/reportServices';
import { Report, CATEGORIES } from '../../data/mockReports';
import { CategoryBadge } from '../../components/CategoryBadge';
import { DrawerMenu } from '@/components/DrawnerMenu';
import { useRef } from 'react'; 

interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    initializeLocation();
    loadReports();
  }, []);

  // Inicializar ubicación
  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de ubicación',
          'SIRSE necesita acceso a tu ubicación para mostrarte reportes cercanos.',
          [{ text: 'OK' }]
        );
        setLocationPermission(false);
        await getLastKnownLocation();
        return;
      }

      setLocationPermission(true);
      await getUserLocation();
    } catch (error) {
      console.error('Error initializing location:', error);
      setUserLocation({
        latitude: 20.0847,
        longitude: -98.3686,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  // Obtener última ubicación conocida
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
        setUserLocation(coords);
      } else {
        setUserLocation({
          latitude: 20.0847,
          longitude: -98.3686,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.error('Error getting last known location:', error);
      setUserLocation({
        latitude: 20.0847,
        longitude: -98.3686,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  // Obtener ubicación actual del usuario
  const getUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation(coords);
    } catch (error) {
      console.error('Error getting location:', error);
      await getLastKnownLocation();
    }
  };

  // Centrar mapa en ubicación del usuario
  const centerOnUser = async () => {
    if (locationPermission) {
      await getUserLocation();
      // Animar el mapa a la nueva ubicación
      if (mapRef.current && userLocation) {
        mapRef.current.animateToRegion(userLocation, 1000);
      }
    } else {
      Alert.alert(
        'Ubicación desactivada',
        'Por favor, activa los permisos de ubicación en la configuración de tu dispositivo.'
      );
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await ReportService.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el icono según la categoría
  const getCategoryIcon = (category: keyof typeof CATEGORIES) => {
    const config = CATEGORIES[category];
    return config.icon;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIRSE</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push(`/explore`)}
        >
          <Text style={styles.menuIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        {userLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={userLocation}
            showsUserLocation={locationPermission}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {/* Marcadores de reportes */}
            {reports.map((report) => (
              <Marker
                key={report.id}
                coordinate={{
                  latitude: report.coordinates.latitude,
                  longitude: report.coordinates.longitude,
                }}
                onPress={() => router.push(`/report/${report.id}`)}
              >
                <View style={styles.customMarker}>
                  <View style={[
                    styles.markerBadge,
                    { backgroundColor: CATEGORIES[report.category].color }
                  ]}>
                    <Text style={styles.markerIcon}>
                      {getCategoryIcon(report.category)}
                    </Text>
                  </View>
                  {report.status === 'Urgente' && (
                    <View style={styles.urgentIndicator} />
                  )}
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Cargando mapa...</Text>
          </View>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={centerOnUser}
          >
            <Text style={styles.controlIcon}>🎯</Text>
          </TouchableOpacity>
        </View>

        {/* FAB Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => {
            Alert.alert(
              'Reportar Incidente',
              'Para reportar un incidente, usa nuestro Chatbot de WhatsApp.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir WhatsApp', onPress: () => {
                  Alert.alert('Próximamente', 'Función en desarrollo');
                }}
              ]
            );
          }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Tipos de reportes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.legendItems}>
            {Object.entries(CATEGORIES).map(([name, config]) => (
              <View key={name} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: config.color }]} />
                <Text style={styles.legendText}>{name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: '33.33%',
    height: '25%',
    borderWidth: 0.5,
    borderColor: '#C8E6C9',
  },
  markerPosition: {
    position: 'absolute',
  },
  userLocation: {
    position: 'absolute',
    top: '45%',
    left: '48%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlIcon: {
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
  },
  legend: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendTitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
    fontWeight: '600',
  },
  legendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#424242',
  },
    customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 18,
  },
  urgentIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});