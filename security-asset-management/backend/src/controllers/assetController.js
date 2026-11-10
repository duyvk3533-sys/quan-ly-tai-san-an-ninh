const db = require('../config/database');

exports.getAllAssets = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM assets ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Lỗi truy xuất dữ liệu' });
    }
};
