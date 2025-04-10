import { AppError } from "./error-handler";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

interface ErrorLogData {
  message: string;
  code: string;
  statusCode: number;
  context: string;
  timestamp: string;
  details?: unknown;
  userAgent?: string;
  url?: string;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isProduction: boolean;
  private errorsCollectionRef = collection(db, "errors");

  private constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
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
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    // 在生產環境中，我們可以將錯誤發送到錯誤追蹤服務
    if (this.isProduction) {
      this.sendToErrorTrackingService(errorData);
    } else {
      // 在開發環境中，我們使用 console
      console.error("[Error Tracking]", errorData);
    }
  }

  private async sendToErrorTrackingService(
    errorData: ErrorLogData
  ): Promise<void> {
    try {
      // 1. 首先嘗試將錯誤存儲到 Firebase
      await this.storeErrorInFirebase(errorData);

      // 2. 然後發送到 API 端點作為備份
      this.sendToApiEndpoint(errorData);
    } catch (error) {
      console.error("Failed to send error to tracking service:", error);

      // 如果 Firebase 存儲失敗，至少嘗試發送到 API 端點
      this.sendToApiEndpoint(errorData);
    }
  }

  private async storeErrorInFirebase(errorData: ErrorLogData): Promise<void> {
    try {
      // 添加額外的 Firebase 特定字段
      const firebaseErrorData = {
        ...errorData,
        createdAt: serverTimestamp(),
        environment: this.isProduction ? "production" : "development",
      };

      // 將錯誤存儲到 Firestore
      await addDoc(this.errorsCollectionRef, firebaseErrorData);
      console.log("Error stored in Firebase successfully");
    } catch (error) {
      console.error("Failed to store error in Firebase:", error);
      throw error; // 重新拋出錯誤以便上層處理
    }
  }

  private sendToApiEndpoint(errorData: ErrorLogData): void {
    // 發送到自己的後端 API
    fetch("/api/error-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    }).catch((error) => {
      console.error("Failed to send error to API endpoint:", error);
    });
  }
}

export const errorTracking = ErrorTrackingService.getInstance();
