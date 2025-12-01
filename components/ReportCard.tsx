import { LocationCoords, useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { getShortAddress } from '@/utils/geoCodingUtils';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Report } from '../config/config_types';
import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
  userLocation?: LocationCoords | null;
}

/**
 * Convierte un timestamp en texto legible (minutos, horas o días)
 */
const getTimeAgo = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
};

/**
 * Acorta la dirección para mostrar solo lo esencial
 */
const shortenAddress = (address: string): string => {
  const parts = address.split(',');
  return parts[0].trim();
};

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const { location: userLocation } = useLocation(false);
  
  // Estado para la ubicación (puede ser del API o geocodificada)
  const [locationText, setLocationText] = useState<string>(() => {
    // Si tiene "WhatsApp", empezar con placeholder
    if (report.address.toLowerCase().includes('whatsapp')) {
      return 'Obteniendo ubicación...';
    }
    // Si no, usar el address directamente
    return shortenAddress(report.address);
  });

  // 🌍 Geocodificar SOLO si es "WhatsApp location"
  useEffect(() => {
    const loadAddress = async () => {
      if (report.address.toLowerCase().includes('whatsapp')) {
        try {
          const address = await getShortAddress(report.coordinates);
          setLocationText(address);
        } catch (error) {
          console.error('Error geocodificando:', error);
          // Fallback a coordenadas si falla
          setLocationText(
            `${report.coordinates.latitude.toFixed(4)}, ${report.coordinates.longitude.toFixed(4)}`
          );
        }
      }
    };

    loadAddress();
  }, [report.address, report.coordinates]);

  // ⏱️ Tiempo transcurrido
  const timeAgo = report.reportedAtTimestamp
    ? getTimeAgo(report.reportedAtTimestamp)
    : '—';

  // 📍 Distancia calculada dinámicamente
  const distance =
    userLocation && report.coordinates
      ? formatDistance(
          calculateDistance(
            { 
              latitude: userLocation.latitude, 
              longitude: userLocation.longitude 
            },
            { 
              latitude: report.coordinates.latitude, 
              longitude: report.coordinates.longitude 
            }
          )
        )
      : '—';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <CategoryBadge category={report.category} size="small" />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {report.title}
            </Text>
            {report.status === 'Urgente' && <StatusBadge status={report.status} />}
          </View>
          <Text style={styles.category}>{report.category}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {locationText}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{timeAgo}</Text>
          {distance !== '—' && (
            <Text style={styles.distance}>{distance}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 14,
    color: '#757575',
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  distance: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
});