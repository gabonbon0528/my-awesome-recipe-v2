# My Awesome Recipe v2

這是一個使用 Next.js 和 Firebase 構建的食譜應用程式。

## 功能特點

- 食譜瀏覽和搜索
- 食譜收藏功能
- 用戶個人食譜管理
- 即時數據同步

## 技術棧

- Next.js
- Firebase (Firestore)
- TypeScript
- Tailwind CSS

## 環境設置

1. 克隆專案：
```bash
git clone https://github.com/your-username/my-awesome-recipe-v2.git
cd my-awesome-recipe-v2
```

2. 安裝依賴：
```bash
npm install
# 或
yarn install
```

3. 環境變數設置：
   - 複製 `.env.example` 文件並重命名為 `.env`
   - 在 [Firebase Console](https://console.firebase.google.com/) 創建新專案
   - 獲取 Firebase 配置資訊
   - 將配置資訊填入 `.env` 文件：
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

4. 啟動開發服務器：
```bash
npm run dev
# 或
yarn dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 部署說明

1. 確保您的環境變數已經在部署平台（如 Vercel）中正確設置
2. 將代碼推送到 GitHub
3. 連接您的 GitHub 倉庫到部署平台
4. 觸發部署流程

## 安全注意事項

- 不要將 `.env` 文件提交到版本控制系統
- 定期更新 Firebase 金鑰
- 在生產環境中使用適當的安全規則

## 貢獻指南

1. Fork 本倉庫
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情
