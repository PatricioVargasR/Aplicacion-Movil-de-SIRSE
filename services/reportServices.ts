import { Report } from '../config/config_types';

/**
 * ReportService - Integración con API real usando XMLHttpRequest
 */

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ReportFilters {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GeographicBounds {
  northEast: {
    latitude: number;
    longitude: number;
  };
  southWest: {
    latitude: number;
    longitude: number;
  };
}

export interface AreaReportFilters {
  bounds: GeographicBounds;
  category?: string;
  status?: string;
  timeRange?: '24h' | '7d' | '30d';
  page?: number;
  limit?: number;
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
}


const BASE_URL = "https://cerberusteck.com.mx/sirse/api";

/**
 * Helper para hacer peticiones XMLHttpRequest
 */
const xhrRequest = <T>(url: string, method: 'GET' | 'POST' = 'GET'): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (error) {
          reject(new Error('Error al parsear la respuesta JSON'));
        }
      } else {
        reject(new Error(`Error HTTP: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Error de red'));
    xhr.ontimeout = () => reject(new Error('Timeout'));
    
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 10000;
    xhr.send();
  });
};

export const ReportService = {
  /**
   * Obtener todos los reportes con filtros opcionales
   * GET /get_all_reports.php?category={category}&status={status}
   */
  getAllReports: async (filters?: { 
    category?: string;
    status?: string;
  }): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = `${BASE_URL}/get_all_reports.php${queryString ? `?${queryString}` : ''}`;

    return xhrRequest<Report[]>(url);
  },

  /**
   * Obtener un reporte por ID (folio)
   * GET /get_report_by_id.php?id={id}
   */
  getReportById: async (id: string): Promise<Report | null> => {

    const url = `${BASE_URL}/get_report_by_id.php?id=${id}`;
    
    try {
      const report = await xhrRequest<Report[]>(url);
      console.log(report)
      return report[0] ?? null;
    } catch (error) {
      console.error('Error obteniendo reporte por ID:', error);
      return null;
    }
  },

  /**
   * Obtener reportes paginados con filtros opcionales
   * GET /get_paginated_reports.php?page={page}&limit={limit}&category={category}&status={status}
   */
  getPaginatedReports: async (
    filters?: ReportFilters
  ): Promise<PaginationResult<Report>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = `${BASE_URL}/get_paginated_reports.php${queryString ? `?${queryString}` : ''}`;

    return xhrRequest<PaginationResult<Report>>(url);
  },

  /**
   * Obtener reportes dentro de un área geográfica
   * GET /get_reports_by_area.php?ne_lat={lat}&ne_lng={lng}&sw_lat={lat}&sw_lng={lng}&category={category}&status={status}&timeRange={range}&page={page}&limit={limit}
   */
  getReportsByArea: async (
    filters: AreaReportFilters
  ): Promise<Report[]> => {
    const params = new URLSearchParams();
    
    // Coordenadas del área
    params.append('ne_lat', filters.bounds.northEast.latitude.toString());
    params.append('ne_lng', filters.bounds.northEast.longitude.toString());
    params.append('sw_lat', filters.bounds.southWest.latitude.toString());
    params.append('sw_lng', filters.bounds.southWest.longitude.toString());
    
    // Filtros opcionales
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.timeRange) params.append('timeRange', filters.timeRange);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const url = `${BASE_URL}/get_reports_by_area.php?${params.toString()}`;
    
    return xhrRequest<Report[]>(url);
  },

  /**
   * Obtener categorías disponibles
   * GET /get_categories.php
   */
  getCategories: async (): Promise<CategoryData[]> => {
    const url = `${BASE_URL}/get_categories.php`;
    return xhrRequest<CategoryData[]>(url);
  },

  /**
   * Obtener estados disponibles
   * GET /get_statuses.php
   */
  getStatuses: async (): Promise<string[]> => {
    const url = `${BASE_URL}/get_statuses.php`;
    return xhrRequest<string[]>(url);
  },

  /**
   * Health check del API
   * GET /
   */
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const url = BASE_URL;
    return xhrRequest<{ status: string; message: string }>(url);
  }
};