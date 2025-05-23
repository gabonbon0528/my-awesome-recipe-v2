import { Timestamp } from "firebase/firestore";

export interface Tag {
  id: string; // Firestore 文件 ID（前端使用）
  name: string; // 顯示名稱（主要用於搜尋與顯示）

  group?: string; // 分類，例如 "料理風格"、"地區"
  aliases?: string[]; // 別名（支援搜尋）
  translations?: Record<string, string>; // 多語系：{ "en": "English Name" }

  visible?: boolean; // 是否顯示在 UI 中
  status?: "active" | "archived" | "pending"; // 控制狀態

  color?: string; // 顯示顏色（UI 用）
  icon?: string; // emoji 或 icon 名稱（例如 "🍜"）

  createdBy?: string; // 使用者 ID（可支援自定 tag 系統）
  createdAt?: Timestamp;
}

export type SerializedTag = {
  id: string;
  name: string;

  group?: string;
  aliases?: string[];
  translations?: Record<string, string>;

  visible?: boolean;
  status?: "active" | "archived" | "pending";

  color?: string;
  icon?: string;

  createdBy?: string;
  createdAt?: string;
};
