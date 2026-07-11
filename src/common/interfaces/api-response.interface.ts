import { PaginationMeta } from './pagination-meta.interface';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  meta?: PaginationMeta;
}
