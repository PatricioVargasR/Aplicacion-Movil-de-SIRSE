export interface Report {
  id: string;
  title: string;
  description: string;
  // category: 'Luminarias' | 'Limpieza' | 'Podas y Cortes' | 'Baches/Semáforos' | 'Obras Públicas';
  category: string;
  status: 'Urgente' | 'En proceso' | 'Pendiente';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  reportedAt: string;              // "2025-11-22 19:56:09"
  reportedAtTimestamp: number;     // 1763841369000
  reporterName: string;
  reporterEmail: string;
  photos: string[];           // lista de URLs
  severity: 'baja' | 'media' | 'alta' | string;
  votes: number;
  comments: number;
  markerColor?: string;
}
// 1. Pendiente - 2. En Proceso 3. Resuelto 3. Rechazado

// ✅ Helper para generar timestamps relativos
const getTimestamp = (hoursAgo: number): number => {
  return Date.now() - (hoursAgo * 60 * 60 * 1000);
};


// Categorías de la app
export const CATEGORIES = {
  'Luminarias': { color: '#FFC107', icon: '💡' },
  'Limpieza': { color: '#4CAF50', icon: '🗑️' },
  'Podas y Cortes': { color: '#2196F3', icon: '✂️' },
  'Baches/Semáforos': { color: '#FF5722', icon: '🚧' },
  'Obras Públicas': { color: '#9C27B0', icon: '🏗️' },
  'Seguridad': { color: '#F44336', icon: '🚨' },
  'Animales': { color: '#795548', icon: '🐕' },
  'Otros': { color: '#607D8B', icon: '📍' }
};

// Mapeo de categorías API → categorías de la app
export const CATEGORY_MAPPING: Record<string, keyof typeof CATEGORIES> = {
  // Limpieza
  'Basura': 'Limpieza',
  'Limpieza': 'Limpieza',
  'Residuos': 'Limpieza',
  
  // Seguridad
  'Persona sospechosa': 'Seguridad',
  'Seguridad': 'Seguridad',
  'Robo': 'Seguridad',
  'Vandalismo': 'Seguridad',
  
  // Baches/Semáforos
  'Baches': 'Baches/Semáforos',
  'Semáforos': 'Baches/Semáforos',
  'Señalización': 'Baches/Semáforos',
  'Vialidad': 'Baches/Semáforos',
  
  // Animales
  'Animal callejero': 'Animales',
  'Animales': 'Animales',
  'Mascota perdida': 'Animales',
  
  // Luminarias
  'Luminarias': 'Luminarias',
  'Alumbrado': 'Luminarias',
  'Luz pública': 'Luminarias',
  
  // Podas y Cortes
  'Podas y Cortes': 'Podas y Cortes',
  'Jardinería': 'Podas y Cortes',
  'Áreas verdes': 'Podas y Cortes',
  
  // Obras Públicas
  'Obras Públicas': 'Obras Públicas',
  'Construcción': 'Obras Públicas',
  'Infraestructura': 'Obras Públicas',
};

/**
 * Mapear categoría de la API a categoría de la app
 */
export const getMappedCategory = (apiCategory: string): keyof typeof CATEGORIES => {
  return CATEGORY_MAPPING[apiCategory] || 'Otros';
};

/**
 * Obtener configuración de categoría (color e icono)
 */
export const getCategoryConfig = (apiCategory: string) => {
  const mappedCategory = getMappedCategory(apiCategory);
  return CATEGORIES[mappedCategory];
};

// En config_types.ts
export const getApiCategories = (appCategory: keyof typeof CATEGORIES): string[] => {
  return Object.entries(CATEGORY_MAPPING)
    .filter(([_, mapped]) => mapped === appCategory)
    .map(([apiCat, _]) => apiCat);
};