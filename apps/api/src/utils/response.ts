export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export function successResponse<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T> {
  return {
    success: true,
    ...(message ? { message } : {}),
    data,
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(message: string, meta?: Record<string, any>): ApiResponse {
  return {
    success: false,
    message,
    ...(meta ? { meta } : {}),
  };
}
