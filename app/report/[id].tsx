import { ReportService } from '@/services/reportServices';
import { getShortAddress } from '@/utils/geoCodingUtils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Platform
} from 'react-native';
import { CategoryBadge } from '../../components/CategoryBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Report } from '../../config/config_types';

const { width } = Dimensions.get('window');

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationText, setLocationText] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    loadReport();
  }, [id]);

  useEffect(() => {
    const loadAddress = async () => {
      if (!report) return;

      if (report.address.toLowerCase().includes('whatsapp')) {
        try {
          const address = await getShortAddress(report.coordinates);
          setLocationText(address);
        } catch (error) {
          console.error('Error geocodificando:', error);
          setLocationText(
            `${report.coordinates.latitude.toFixed(4)}, ${report.coordinates.longitude.toFixed(4)}`
          );
        }
      } else {
        setLocationText(report.address);
      }
    };

    loadAddress();
  }, [report]);

  const loadReport = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await ReportService.getReportById(id);
      setReport(data || null);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number | string | undefined) => {
    if (!timestamp) return 'Fecha no disponible';
    const time = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
    const date = new Date(time < 10000000000 ? time * 1000 : time);

    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleShare = async () => {
    if (!report) return;

    try {
      // Crear deep link para la app
      const deepLink = Linking.createURL(`report/${report.id}`);
      
      // En Android, el URL se agrega automáticamente al mensaje
      // En iOS, necesitamos incluirlo manualmente
      const messageText = `🚨 Reporte SIRSE: ${report.title}

📋 ${report.description}

📍 ${locationText}
🕒 ${formatTimestamp(report.reportedAtTimestamp)}
📊 Estado: ${report.status}`;

      const shareContent = Platform.OS === 'ios' 
        ? {
            message: `${messageText}\n\n👉 Ver más: ${deepLink}`,
            title: `Reporte: ${report.title}`
          }
        : {
            message: messageText,
            url: deepLink,
            title: `Reporte: ${report.title}`
          };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartido vía:', result.activityType);
        } else {
          console.log('Compartido exitosamente');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo compartir el reporte');
      console.error('Error al compartir:', error);
    }
  };

  const handleCopyLink = async () => {
    if (!report) return;

    try {
      const deepLink = Linking.createURL(`report/${report.id}`);
      
      // En React Native no hay clipboard nativo, pero podemos mostrar el link
      Alert.alert(
        'Link del reporte',
        deepLink,
        [
          {
            text: 'Compartir',
            onPress: handleShare
          },
          {
            text: 'Cerrar',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error generando link:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Reporte no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasPhotos = report.photos && report.photos.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Imagen principal */}
        {hasPhotos && (
          <View style={styles.imageSection}>
            <Image 
              source={{ uri: report.photos[selectedPhotoIndex] }} 
              style={styles.mainImage}
              resizeMode="cover"
            />
            {report.photos.length > 1 && (
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>
                  {selectedPhotoIndex + 1} / {report.photos.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Galería de fotos */}
        {hasPhotos && report.photos.length > 1 && (
          <View style={styles.gallery}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContent}
            >
              {report.photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPhotoIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedPhotoIndex === index && styles.thumbnailSelected
                  ]}
                >
                  <Image 
                    source={{ uri: photo }} 
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Información general */}
        <View style={styles.infoCard}>
          <View style={styles.titleSection}>
            <CategoryBadge category={report.category} size="large" />
            <View style={styles.titleInfo}>
              <Text style={styles.title}>{report.title}</Text>
              <StatusBadge status={report.status} />
            </View>
          </View>

          {/* Detalles */}
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ubicación</Text>
                <Text style={styles.detailValue}>
                  {locationText || 'Cargando ubicación...'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🕐</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha y hora</Text>
                <Text style={styles.detailValue}>
                  {formatTimestamp(report.reportedAtTimestamp)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>👤</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Reportado por</Text>
                <Text style={styles.detailValue}>{report.reporterName}</Text>
              </View>
            </View>

            {report.severity && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>⚠️</Text>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Severidad</Text>
                  <Text style={[
                    styles.detailValue,
                    styles.severityText,
                    { color: getSeverityColor(report.severity) }
                  ]}>
                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Descripción</Text>
            <Text style={styles.descriptionText}>{report.description}</Text>
          </View>

          {report.status === 'En proceso' && (
            <View style={styles.noteCard}>
              <Text style={styles.noteText}>
                Nota: Este reporte ha sido enviado a las autoridades correspondientes para su atención.
              </Text>
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareIcon}>📤</Text>
            <Text style={styles.shareText}>Compartir</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'alta': return '#F44336';
    case 'media': return '#FF9800';
    case 'baja': return '#4CAF50';
    default: return '#757575';
  }
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  photoCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  gallery: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
  },
  galleryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: '#2196F3',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 8,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  detailSection: {
    marginBottom: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
  },
  severityText: {
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  noteText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shareIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  shareText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
});