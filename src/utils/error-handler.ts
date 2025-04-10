import { errorTracking } from './error-tracking';

// 自定義錯誤類型
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 錯誤代碼枚舉
export enum ErrorCode {
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// 錯誤處理函數
export function handleError(error: unknown, context: string): AppError {
  console.error(`[${context}] Error:`, error);

  if (error instanceof AppError) {
    errorTracking.trackError(error, context);
    return error;
  }

  // Firebase 錯誤處理
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && error.code.startsWith('firebase/')) {
    const appError = new AppError(
      `Firebase error: ${error instanceof Error ? error.message : 'Unknown Firebase error'}`,
      ErrorCode.FIREBASE_ERROR,
      500,
      error
    );
    errorTracking.trackError(appError, context);
    return appError;
  }

  // 通用錯誤處理
  const appError = new AppError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    ErrorCode.INTERNAL_ERROR,
    500,
    error
  );
  errorTracking.trackError(appError, context);
  return appError;
}

// 日誌記錄函數
export function logInfo(message: string, data?: unknown) {
  console.log(`[INFO] ${message}`, data ? data : '');
}

export function logError(message: string, error: unknown) {
  console.error(`[ERROR] ${message}`, error);
}

export function logWarning(message: string, data?: unknown) {
  console.warn(`[WARNING] ${message}`, data ? data : '');
}

export function logDebug(message: string, data?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${message}`, data ? data : '');
  }
} 