
import { MOCK_REPORTS, Report } from '../data/mockReports';

/**
 * ReportService - Simulates API calls with static data
 * 
 * TODO: Replace with real API integration
 * - Change Promise.resolve() to actual fetch/axios calls
 * - Add error handling for network failures
 * - Implement authentication tokens if needed
 * - Add retry logic for failed requests
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
  simulateOffline?: boolean;   // Para pruebas sin conexión
  simulateEmpty?: boolean;     // Para pruebas sin datos
}



export const ReportService = {
  /**
   * Fetch all reports with optional filters
   * 
   * @future API endpoint: GET /api/reports?category={category}&status={status}
   */
  getAllReports: async (filters?: { 
    category?: string; 
    status?: string;
  }): Promise<Report[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let reports = [...MOCK_REPORTS];
        
        // Apply filters if provided
        if (filters?.category) {
          reports = reports.filter(r => r.category === filters.category);
        }
        if (filters?.status) {
          reports = reports.filter(r => r.status === filters.status);
        }
        
        resolve(reports);
      }, 500); // Simulate network delay
    });
    
    // TODO: Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/reports?${queryParams}`);
    // return response.json();
  },

  /**
   * Fetch single report by ID
   * 
   * @future API endpoint: GET /api/reports/:id
   */
  getReportById: async (id: string): Promise<Report | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = MOCK_REPORTS.find(r => r.id === id);
        resolve(report);
      }, 300);
    });
    
    // TODO: Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    // return response.json();
  },

  /**
   * Fetch paginated reports with optional filters
   *
   * @future: /api/reports?page={page}&limit={limit}&category={category}&status={status}
   */
  getPaginatedReports: async (
    filters?: ReportFilters
  ): Promise<PaginationResult<Report>> => {
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        // 🔴 Simular sin conexión
        if (filters?.simulateOffline) {
          return reject({
            message: "No hay conexión a internet.",
            code: "OFFLINE"
          });
        }

        // Valores por defecto
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 1; // 1 por página como pediste
        let reports = [...MOCK_REPORTS];

        // 🔵 Simular sin datos
        if (filters?.simulateEmpty) {
          reports = [];
        }

        // Aplicar filtros
        if (filters?.category) {
          reports = reports.filter(r => r.category === filters.category);
        }
        if (filters?.status) {
          reports = reports.filter(r => r.status === filters.status);
        }

        // Validación sin resultados
        if (reports.length === 0) {
          return resolve({
            data: [],
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false
          });
        }

        // Paginación manual
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = reports.slice(startIndex, endIndex);

        const total = reports.length;
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        resolve({
          data: paginatedData,
          page,
          limit,
          total,
          totalPages,
          hasMore
        });

      }, 800); // Simula delay realista
    });
  },



};