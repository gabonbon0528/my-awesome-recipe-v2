import { AppError } from "./error-handler";

interface ErrorLogData {
  message: string;
  code: string;
  statusCode: number;
  context: string;
  timestamp: string;
  details?: unknown;
  userAgent?: string;
  url?: string;
  stack?: string;
  environment?: string;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isProduction: boolean;
  private isInitialized = false;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    // 設置全局未捕獲錯誤處理器
    if (typeof window !== "undefined") {
      window.addEventListener("error", (event) => {
        this.handleUncaughtError(event.error || event.message, "uncaught");
      });
      
      window.addEventListener("unhandledrejection", (event) => {
        this.handleUncaughtError(event.reason, "unhandledRejection");
      });
    }
    
    this.isInitialized = true;
  }

  private handleUncaughtError(error: Error | string, source: string): void {
    const appError = new AppError(
      typeof error === "string" ? error : error.message,
      "UNCAUGHT_ERROR",
      500,
      { source, originalError: error }
    );
    
    this.trackError(appError, `global-${source}`);
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public trackError(error: AppError, context: string): void {
    const errorData: ErrorLogData = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context,
      timestamp: new Date().toISOString(),
      details: error.details,
      stack: error.stack,
      environment: process.env.NODE_ENV,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    this.sendToErrorTrackingService(errorData);
  }

  private async sendToErrorTrackingService(
    errorData: ErrorLogData
  ): Promise<void> {
    try {
      await this.sendToApiEndpoint(errorData);
    } catch (error) {
      console.error("Failed to send error to tracking service:", error);
    }
  }

  private async sendToApiEndpoint(errorData: ErrorLogData): Promise<void> {
    // 發送到自己的後端 API
    const response = await fetch("/api/error-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send error to API endpoint: ${response.status} ${response.statusText}`);
    }
  }
}

export const errorTracking = ErrorTrackingService.getInstance();
