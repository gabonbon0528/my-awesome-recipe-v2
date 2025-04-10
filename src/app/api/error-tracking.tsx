import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 解析請求體
    const body = await request.json();

    // 獲取錯誤信息
    const { message, stack, timestamp = new Date().toISOString() } = body;

    // 在實際應用中，您可能會將錯誤存儲到數據庫或發送到錯誤追蹤服務
    // 這裡我們只是記錄到控制台
    console.error("Error tracked:", {
      message,
      stack,
      timestamp,
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

// 添加 GET 方法以檢查 API 是否正常工作
export async function GET() {
  return NextResponse.json(
    { status: "Error tracking API is running" },
    { status: 200 }
  );
}
