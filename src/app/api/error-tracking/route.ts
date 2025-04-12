import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 定義錯誤日誌數據接口
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

// 錯誤日誌文件路徑
const ERROR_LOG_FILE = path.join(process.cwd(), "logs", "errors.json");

// 確保日誌目錄存在
function ensureLogDirectory() {
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// 讀取錯誤日誌
function readErrorLogs(): ErrorLogData[] {
  ensureLogDirectory();
  
  if (!fs.existsSync(ERROR_LOG_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(ERROR_LOG_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read error logs:", error);
    return [];
  }
}

// 寫入錯誤日誌
function writeErrorLogs(logs: ErrorLogData[]): void {
  ensureLogDirectory();
  
  try {
    fs.writeFileSync(ERROR_LOG_FILE, JSON.stringify(logs, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write error logs:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 解析請求體
    const errorData: ErrorLogData = await request.json();

    // 驗證必要的字段
    if (!errorData.message || !errorData.code || !errorData.context) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 確保時間戳存在
    if (!errorData.timestamp) {
      errorData.timestamp = new Date().toISOString();
    }

    // 添加環境信息
    errorData.environment = process.env.NODE_ENV;

    // 讀取現有錯誤日誌
    const logs = readErrorLogs();
    
    // 添加新錯誤
    logs.unshift(errorData);
    
    // 限制日誌數量（保留最新的 100 條）
    const limitedLogs = logs.slice(0, 100);
    
    // 寫入錯誤日誌
    writeErrorLogs(limitedLogs);

    // 記錄到控制台
    console.error("Error tracked:", {
      message: errorData.message,
      code: errorData.code,
      context: errorData.context,
      timestamp: errorData.timestamp,
    });

    // 返回成功響應
    return NextResponse.json(
      { success: true, message: "Error tracked successfully" },
      { status: 200 }
    );
  } catch (error) {
    // 處理請求處理過程中的錯誤
    console.error("Error processing error tracking request:", error);

    return NextResponse.json(
      { success: false, message: "Failed to process error tracking request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const logs = readErrorLogs();
    
    return NextResponse.json(
      { 
        success: true, 
        count: logs.length,
        logs: logs.slice(0, 50) // 只返回最新的 50 條
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve error logs:", error);
    
    return NextResponse.json(
      { success: false, message: "Failed to retrieve error logs" },
      { status: 500 }
    );
  }
} 