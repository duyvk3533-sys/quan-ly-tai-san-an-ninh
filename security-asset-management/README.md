# Hệ thống Quản lý Tài sản và Thiết bị An ninh

## Yêu cầu môi trường
- Node.js (v18+)
- Docker (để chạy MySQL)

## Hướng dẫn cài đặt & Khởi chạy

1. **Khởi động Database (MySQL)**
   ```bash
   docker-compose up -d
   ```
2. **Khởi động Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Khởi động Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
