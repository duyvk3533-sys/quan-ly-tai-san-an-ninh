SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS security_asset_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE security_asset_db;

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    category VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    status ENUM('active', 'maintenance', 'broken') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO assets (asset_code, name, category, status) VALUES 
('CAM-001', 'Camera an ninh sảnh chính', 'Camera', 'active'),
('ACC-001', 'Đầu đọc thẻ từ cổng A', 'Access Control', 'maintenance'),
('SEN-042', 'Cảm biến khói kho hàng', 'Sensor', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), status=VALUES(status);
