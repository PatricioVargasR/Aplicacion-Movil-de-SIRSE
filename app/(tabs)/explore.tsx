import { useLocation } from '@/hooks/useLocation';
import { ReportService, CategoryData } from '@/services/reportServices';
import { calculateGeographicBounds } from '@/utils/locationUtils';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ReportCard } from '../../components/ReportCard';
import { Report, getMappedCategory } from '../../config/config_types';

type FilterType = 'special' | 'category' | 'status';

interface Filter {
  type: FilterType;
  value: string;
  label: string;
}

export default function FeedScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  
  // Filtros dinámicos
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>({
    type: 'special',
    value: 'Todos',
    label: 'Todos'
  });

  const { location, hasPermission, loading: locationLoading } = useLocation(true);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar categorías y estados disponibles
  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true);
      try {
        const [categoriesData, statusesData] = await Promise.all([
          ReportService.getCategories(),
          ReportService.getStatuses()
        ]);
        setCategories(categoriesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  // Construir lista de filtros
// Construir lista de filtros
const getAllFilters = (): Filter[] => {
  const filters: Filter[] = [
    { type: 'special', value: 'Todos', label: 'Todos' },
    { type: 'special', value: 'Recientes', label: 'Recientes' },
    { type: 'special', value: 'Cerca de ti', label: 'Cerca de ti' },
  ];

  // Agregar categorías
  categories.forEach(cat => {
    const categoryName = typeof cat === 'string' ? cat : cat.name;
    const mapped = getMappedCategory(categoryName); // ✅ Esto devuelve un string como "Limpieza"
    filters.push({
      type: 'category',
      value: categoryName,
      label: mapped // ✅ Ahora mapped es un string
    });
  });

  // Agregar estados
  statuses.forEach(status => {
    const statusName = typeof status === 'string' ? status : status.name;
    filters.push({
      type: 'status',
      value: statusName,
      label: statusName // ✅ statusName es un string
    });
  });

  return filters;
};

  const allFilters = getAllFilters();

  // Cargar reportes según el filtro activo
  const loadReports = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Filtro "Cerca de Ti"
      if (activeFilter.value === 'Cerca de ti') {
        if (!location) {
          setErrorMessage('No se pudo obtener tu ubicación.');
          setReports([]);
          setLoading(false);
          return;
        }

        const bounds = calculateGeographicBounds(location, 5);
        const nearbyReports = await ReportService.getReportsByArea({ bounds });

        setReports(nearbyReports);

        if (nearbyReports.length === 0) {
          setErrorMessage('No hay reportes cerca de ti (radio de 5 km).');
        }

        setHasMore(false);
        setLoading(false);
        return;
      }

      // Filtro "Recientes"
      if (activeFilter.value === 'Recientes') {
        if (!location) {
          setErrorMessage('No se pudo obtener tu ubicación para calcular distancia.');
          setReports([]);
          setLoading(false);
          return;
        }

        const bounds = calculateGeographicBounds(location, 50);
        const recentReports = await ReportService.getReportsByArea({
          bounds,
          timeRange: '24h',
        });

        setReports(recentReports);

        if (recentReports.length === 0) {
          setErrorMessage('No hay reportes recientes.');
        }

        setHasMore(false);
        setLoading(false);
        return;
      }

      // Filtros con paginación (Todos, Categorías, Estados)
      const filters: any = {};
      
      if (activeFilter.type === 'category') {
        filters.category = activeFilter.value;
      } else if (activeFilter.type === 'status') {
        filters.status = activeFilter.value;
      }

      const response = await ReportService.getPaginatedReports({
        page,
        limit: 10,
        ...filters
      });

      if (page === 1) {
        setReports(response.data);
      } else {
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

  useEffect(() => {
    if (activeFilter.value === 'Cerca de ti' && locationLoading) {
      setLoading(true);
      return;
    }

    loadReports();
  }, [page, activeFilter, location, locationLoading]);

  const onChangeFilter = (filter: Filter) => {
    if (filter.value === 'Cerca de ti' && !hasPermission) {
      Alert.alert(
        'Ubicación requerida',
        'Para ver reportes cercanos, necesitamos acceso a tu ubicación. Por favor, activa los permisos en la configuración.',
        [{ text: 'Cancelar', style: 'cancel' }]
      );
      return;
    }

    setActiveFilter(filter);
    setPage(1);
    setHasMore(true);
    setReports([]);
  };

  const onLoadMore = () => {
    if (activeFilter.value !== 'Recientes' && 
        activeFilter.value !== 'Cerca de ti' && 
        hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

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
        {filtersLoading ? (
          <ActivityIndicator size="small" color="#2196F3" style={{ marginLeft: 16 }} />
        ) : (
          allFilters.map((filter) => (
            <TouchableOpacity
              key={`${filter.type}-${filter.value}`}
              style={[
                styles.filterButton,
                activeFilter.value === filter.value && styles.filterButtonActive
              ]}
              onPress={() => onChangeFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter.value === filter.value && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))
        )}
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
            {activeFilter.value === 'Cerca de ti' 
              ? 'Buscando reportes cercanos...' 
              : 'Cargando reportes...'}
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

          {loading && page > 1 && (
            <View style={{ padding: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}

          {hasMore && !loading && 
           activeFilter.value !== 'Recientes' && 
           activeFilter.value !== 'Cerca de ti' && (
            <TouchableOpacity
              style={{ padding: 16, alignItems: 'center' }}
              onPress={onLoadMore}
            >
              <Text style={{ color: '#2196F3', fontWeight: '600' }}>Cargar más</Text>
            </TouchableOpacity>
          )}

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