// ==========================================
// app/heatmap.tsx - PANTALLA DE MAPA DE CALOR
// ==========================================

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Report, CATEGORIES } from '@/data/mockReports';
import { ReportService } from '@/services/reportServices';

const { width, height } = Dimensions.get('window');

export default function HeatmapScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    loadReports();
  }, [selectedCategory, timeRange]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const filters = selectedCategory ? { category: selectedCategory } : {};
      const data = await ReportService.getAllReports(filters);
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular densidad de reportes por zona (simulado)
  const calculateHeatZones = () => {
    const zones = [
      { x: 20, y: 15, intensity: 0.9, count: 12 }, // Centro
      { x: 60, y: 25, intensity: 0.7, count: 8 },  // Norte
      { x: 35, y: 60, intensity: 0.5, count: 5 },  // Sur
      { x: 75, y: 70, intensity: 0.3, count: 3 },  // Este
    ];
    return zones;
  };

  const heatZones = calculateHeatZones();

  // Obtener color según intensidad
  const getHeatColor = (intensity: number) => {
    if (intensity >= 0.8) return 'rgba(255, 0, 0, 0.7)';      // Rojo intenso
    if (intensity >= 0.6) return 'rgba(255, 87, 34, 0.6)';    // Naranja
    if (intensity >= 0.4) return 'rgba(255, 152, 0, 0.5)';    // Amarillo-naranja
    if (intensity >= 0.2) return 'rgba(255, 235, 59, 0.4)';   // Amarillo
    return 'rgba(76, 175, 80, 0.3)';                          // Verde (bajo)
  };

  // Estadísticas por categoría
  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    reports.forEach(report => {
      stats[report.category] = (stats[report.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Calor</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Selector de Rango de Tiempo */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.sectionTitle}>Período de análisis</Text>
          <View style={styles.timeRangeButtons}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '24h' && styles.timeButtonActive
              ]}
              onPress={() => setTimeRange('24h')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === '24h' && styles.timeButtonTextActive
              ]}>
                24 horas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '7d' && styles.timeButtonActive
              ]}
              onPress={() => setTimeRange('7d')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === '7d' && styles.timeButtonTextActive
              ]}>
                7 días
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '30d' && styles.timeButtonActive
              ]}
              onPress={() => setTimeRange('30d')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === '30d' && styles.timeButtonTextActive
              ]}>
                30 días
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mapa de Calor */}
        <View style={styles.heatmapCard}>
          <Text style={styles.cardTitle}>Zonas de Mayor Incidencia</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          ) : (
            <View style={styles.heatmapContainer}>
              {/* Grid de fondo */}
              <View style={styles.gridBackground}>
                {[...Array(12)].map((_, i) => (
                  <View key={i} style={styles.gridCell} />
                ))}
              </View>

              {/* Zonas de calor */}
              {heatZones.map((zone, index) => (
                <View
                  key={index}
                  style={[
                    styles.heatZone,
                    {
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      backgroundColor: getHeatColor(zone.intensity),
                      width: 80 + (zone.intensity * 60),
                      height: 80 + (zone.intensity * 60),
                    }
                  ]}
                >
                  <View style={styles.zoneLabel}>
                    <Text style={styles.zoneLabelText}>{zone.count}</Text>
                  </View>
                </View>
              ))}

              {/* Marcador de ubicación del usuario */}
              <View style={styles.userMarker}>
                <View style={styles.userDot} />
              </View>
            </View>
          )}

          {/* Leyenda de intensidad */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Nivel de incidencia</Text>
            <View style={styles.legendScale}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(76, 175, 80, 0.3)' }]} />
                <Text style={styles.legendText}>Baja</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 235, 59, 0.4)' }]} />
                <Text style={styles.legendText}>Media</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 152, 0, 0.5)' }]} />
                <Text style={styles.legendText}>Alta</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.7)' }]} />
                <Text style={styles.legendText}>Crítica</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Estadísticas por Categoría */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Incidentes por Categoría</Text>
          <Text style={styles.statsSubtitle}>
            Total: {reports.length} reportes
          </Text>

          <View style={styles.categoryList}>
            {Object.entries(CATEGORIES).map(([category, config]) => {
              const count = categoryStats[category] || 0;
              const percentage = reports.length > 0 
                ? ((count / reports.length) * 100).toFixed(0) 
                : 0;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.categoryItemActive
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category ? null : category
                  )}
                >
                  <View style={styles.categoryLeft}>
                    <View style={[
                      styles.categoryIcon,
                      { backgroundColor: config.color }
                    ]}>
                      <Text style={styles.categoryEmoji}>{config.icon}</Text>
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryCount}>{count} reportes</Text>
                    </View>
                  </View>

                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            width: `${percentage}%` as any,
                            backgroundColor: config.color
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>💡 Recomendaciones</Text>
          <View style={styles.recommendationsList}>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>🚨</Text>
              <Text style={styles.recommendationText}>
                Evita transitar por zonas marcadas en rojo durante horarios nocturnos
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>👥</Text>
              <Text style={styles.recommendationText}>
                Mantén informados a tus familiares sobre tu ubicación
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>📱</Text>
              <Text style={styles.recommendationText}>
                Activa las notificaciones para recibir alertas en tiempo real
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de actualización */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadReports}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
          <Text style={styles.refreshText}>Actualizar datos</Text>
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    fontSize: 28,
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  placeholder: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  timeRangeContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#2196F3',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: '#FFF',
  },
  heatmapCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  gridBackground: {
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
  heatZone: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  zoneLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },
  userMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
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
  legend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  legendScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 40,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#757575',
  },
  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryItemActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#757575',
  },
  categoryRight: {
    alignItems: 'flex-end',
    width: 80,
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recommendationsCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationIcon: {
    fontSize: 20,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});