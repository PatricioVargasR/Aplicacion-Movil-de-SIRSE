import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ReportService } from '@/services/reportServices';
import { Report } from '../../data/mockReports';
import { ReportCard } from '../../components/ReportCard';
import { useLocation } from '@/hooks/useLocation';
import { calculateGeographicBounds } from '@/utils/locationUtils';

type FilterTab = 'Todos' | 'Recientes' | 'Cerca de ti' | 'En proceso';

// TODO: Realizar notificaciones

export default function FeedScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');

  // Hook de ubicación
  const { location, hasPermission, loading: locationLoading } = useLocation(true);

  // Paginación (solo para "Todos" y "En proceso")
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar reportes según el filtro activo
  const loadReports = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Filtro "Cerca de Ti"
      if (activeFilter === 'Cerca de ti') {
        if (!location) {
          setErrorMessage('No se pudo obtener tu ubicación.');
          setReports([]);
          setLoading(false);
          return;
        }

        // Calcular límites geográficos (5km de radio)
        const bounds = calculateGeographicBounds(location, 5);

        // Obtener reportes del área
        const nearbyReports = await ReportService.getReportsByArea({
          bounds,
          // Puedes agregar más filtros aquí si lo deseas
        });

        setReports(nearbyReports);

        if (nearbyReports.length === 0) {
          setErrorMessage('No hay reportes cerca de ti (radio de 5 km).');
        }

        setHasMore(false); // No hay paginación en "Cerca de ti"
        setLoading(false);
        return;
      }

      // Filtro "Recientes" (últimas 24 horas)
      if (activeFilter === 'Recientes') {
        if (!location) {
          setErrorMessage('No se pudo obtener tu ubicación para calcular distancia.');
          setReports([]);
          setLoading(false);
          return;
        }

        // Obtener área amplia
        const bounds = calculateGeographicBounds(location, 50); // 50km de radio

        const recentReports = await ReportService.getReportsByArea({
          bounds,
          timeRange: '24h',
        });

        setReports(recentReports);

        if (recentReports.length === 0) {
          setErrorMessage('No hay reportes recientes.');
        }

        setHasMore(false); // No hay paginación en "Recientes"
        setLoading(false);
        return;
      }

      // Filtros "Todos" y "En proceso" - con paginación
      const response = await ReportService.getPaginatedReports({
        page,
        limit: 10,
        status: activeFilter === 'En proceso' ? 'En proceso' : undefined,
      });

      // Si page === 1 reemplazamos; si no, acumulamos
      if (page === 1) {
        setReports(response.data);
      } else {
        // Evitamos duplicados
        setReports(prev => {
          const ids = new Set(prev.map(r => r.id));
          const newItems = response.data.filter(r => !ids.has(r.id));
          return [...prev, ...newItems];
        });
      }

      setHasMore(response.hasMore);

      if (response.total === 0) {
        setErrorMessage('No hay reportes disponibles.');
      }
    } catch (error: any) {
      if (error?.code === 'OFFLINE') {
        setErrorMessage('Sin conexión a internet.');
      } else {
        setErrorMessage('Ocurrió un error al cargar reportes.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter, location]);

  // Ejecutar carga cuando cambia page, activeFilter o location
  useEffect(() => {
    // Si el filtro es "Cerca de ti" y la ubicación está cargando, esperar
    if (activeFilter === 'Cerca de ti' && locationLoading) {
      setLoading(true);
      return;
    }

    loadReports();
  }, [page, activeFilter, location, locationLoading]);

  // Cuando el usuario cambia filtro, reiniciamos la paginación
  const onChangeFilter = (filter: FilterTab) => {
    // Si selecciona "Cerca de ti" sin permisos de ubicación
    if (filter === 'Cerca de ti' && !hasPermission) {
      Alert.alert(
        'Ubicación requerida',
        'Para ver reportes cercanos, necesitamos acceso a tu ubicación. Por favor, activa los permisos en la configuración.',
        [
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
      return;
    }

    setActiveFilter(filter);
    setPage(1);
    setHasMore(true);
    setReports([]);
  };

  const onLoadMore = () => {
    // Solo para filtros con paginación
    if ((activeFilter === 'Todos' || activeFilter === 'En proceso') && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const filters: FilterTab[] = ['Todos', 'Recientes', 'Cerca de ti', 'En proceso'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feed de Reportes</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => onChangeFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mensaje de error / sin datos */}
      {errorMessage && !loading && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: '#F44336', textAlign: 'center' }}>
            {errorMessage}
          </Text>
        </View>
      )}

      {/* Reports List */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>
            {activeFilter === 'Cerca de ti' ? 'Buscando reportes cercanos...' : 'Cargando reportes...'}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.reportsList}>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              userLocation={location}
              onPress={() => router.push(`/report/${report.id}`)}
            />
          ))}

          {/* Loader para "cargando siguiente página" */}
          {loading && page > 1 && (
            <View style={{ padding: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}

          {/* Botón Cargar más (solo para Todos y En proceso) */}
          {hasMore && !loading && (activeFilter === 'Todos' || activeFilter === 'En proceso') && (
            <TouchableOpacity
              style={{ padding: 16, alignItems: 'center' }}
              onPress={onLoadMore}
            >
              <Text style={{ color: '#2196F3', fontWeight: '600' }}>Cargar más</Text>
            </TouchableOpacity>
          )}

          {/* Mensaje cuando no hay más reportes */}
          {!hasMore && reports.length > 0 && (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: '#757575', fontSize: 14 }}>
                No hay más reportes
              </Text>
            </View>
          )}
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    fontSize: 28,
    color: '#FFF',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
  reportsList: {
    flex: 1,
    paddingVertical: 8,
  }
});