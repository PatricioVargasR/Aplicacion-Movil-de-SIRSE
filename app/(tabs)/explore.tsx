import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ReportService } from '@/services/reportServices';
import { Report } from '../../data/mockReports';
import { ReportCard } from '../../components/ReportCard';

type FilterTab = 'Todos' | 'Recientes' | 'Cerca de ti' | 'En proceso';

export default function FeedScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // loadReports ahora depende de page y activeFilter (useCallback para estabilidad)
  const loadReports = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await ReportService.getPaginatedReports({
        page,
        limit: 10, // 1 por página según lo solicitado
        // Puedes mapear el filtro "En proceso" a status, etc.
        status: activeFilter === 'En proceso' ? 'En proceso' : undefined,
        // añadir category u otros filtros según necesites
      });

      // Si page === 1 reemplazamos; si no, acumulamos
      if (page === 1) {
        setReports(response.data);
      } else {
        // Evitamos duplicados por si acaso
        setReports(prev => {
          const ids = new Set(prev.map(r => r.id));
          const newItems = response.data.filter(r => !ids.has(r.id));
          return [...prev, ...newItems];
        });
      }

      setHasMore(response.hasMore);

      // Si no hay datos en la primera página mostramos mensaje
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
  }, [page, activeFilter]);

  // Ejecutar carga cuando cambia page o activeFilter
  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeFilter]);

  // Cuando el usuario cambia filtro, reiniciamos la paginación
  const onChangeFilter = (filter: FilterTab) => {
    setActiveFilter(filter);
    setPage(1);       // dispara el useEffect que llama loadReports
    setHasMore(true); // reset
    setReports([]);   // limpiamos lista previa
  };

  const onLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1); // No llamamos loadReports aquí
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
      {errorMessage && (
        <View style={{ padding: 12, alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
        </View>
      )}

      {/* Reports List */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <ScrollView style={styles.reportsList}>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onPress={() => router.push(`/report/${report.id}`)}
            />
          ))}

          {/* Loader para "cargando siguiente página" */}
          {loading && page > 1 && (
            <View style={{ padding: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}

          {/* Botón Cargar más */}
          {hasMore && !loading && (
            <TouchableOpacity
              style={{ padding: 16, alignItems: 'center' }}
              onPress={onLoadMore}
            >
              <Text style={{ color: '#2196F3', fontWeight: '600' }}>Cargar más</Text>
            </TouchableOpacity>
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
  },
  reportsList: {
    flex: 1,
    paddingVertical: 8,
  }
});
