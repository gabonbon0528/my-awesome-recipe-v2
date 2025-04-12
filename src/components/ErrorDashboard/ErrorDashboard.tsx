import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface ErrorLog {
  message: string;
  code: string;
  statusCode: number;
  context: string;
  timestamp: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
  stack?: string;
  environment?: string;
}

export default function ErrorDashboard() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/error-tracking");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch errors: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.logs)) {
          setErrors(data.logs);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch errors:", err);
        setError("無法載入錯誤日誌，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss", {
        locale: zhTW,
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 500) return "bg-red-100 text-red-800";
    if (statusCode >= 400) return "bg-yellow-100 text-yellow-800";
    if (statusCode >= 300) return "bg-blue-100 text-blue-800";
    if (statusCode >= 200) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">錯誤！</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">錯誤追蹤儀表板</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">最近錯誤</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      時間
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      錯誤代碼
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      消息
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      狀態碼
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      上下文
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {errors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        沒有錯誤記錄
                      </td>
                    </tr>
                  ) : (
                    errors.map((error, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedError(error)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(error.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {error.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                          {error.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              error.statusCode
                            )}`}
                          >
                            {error.statusCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {error.context}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedError ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">錯誤詳情</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      錯誤代碼
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedError.code}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">消息</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedError.message}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      狀態碼
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedError.statusCode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      上下文
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedError.context}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">時間</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedError.timestamp)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">環境</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedError.environment || "未知"}
                    </dd>
                  </div>
                  {selectedError.url && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">URL</dt>
                      <dd className="mt-1 text-sm text-gray-900 break-all">
                        {selectedError.url}
                      </dd>
                    </div>
                  )}
                  {selectedError.userAgent && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        用戶代理
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 break-all">
                        {selectedError.userAgent}
                      </dd>
                    </div>
                  )}
                  {selectedError.stack && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        堆疊追蹤
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {selectedError.stack}
                      </dd>
                    </div>
                  )}
                  {selectedError.details && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        詳細信息
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(selectedError.details, null, 2)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">錯誤詳情</h2>
              </div>
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                請選擇一個錯誤以查看詳情
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
