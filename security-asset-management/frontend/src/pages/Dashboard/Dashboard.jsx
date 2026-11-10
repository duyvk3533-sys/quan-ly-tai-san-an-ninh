import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const fallbackAssets = [
  { id: 1, asset_code: 'CAM-001', name: 'Camera an ninh sảnh chính', category: 'Camera', status: 'active' },
  { id: 2, asset_code: 'ACC-001', name: 'Đầu đọc thẻ từ cổng A', category: 'Kiểm soát truy cập', status: 'maintenance' },
  { id: 3, asset_code: 'SEN-042', name: 'Cảm biến khói kho hàng', category: 'Cảm biến', status: 'broken' },
  { id: 4, asset_code: 'NET-011', name: 'Switch trung tâm', category: 'Mạng', status: 'active' },
];

const statusMap = {
  active: { label: 'Hoạt động', className: 'status status-success' },
  maintenance: { label: 'Bảo trì', className: 'status status-warning' },
  broken: { label: 'Hỏng', className: 'status status-danger' },
};

export default function Dashboard() {
  const [assets, setAssets] = useState(fallbackAssets);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assets')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAssets(response.data);
        }
      })
      .catch(() => {
        setAssets(fallbackAssets);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = assets.length;
    const active = assets.filter((asset) => asset.status === 'active').length;
    const maintenance = assets.filter((asset) => asset.status === 'maintenance').length;
    const broken = assets.filter((asset) => asset.status === 'broken').length;

    return { total, active, maintenance, broken };
  }, [assets]);

  return (
    <div className="dashboard-page">
      <div className="overview-banner">
        <div>
          <p className="eyebrow">Bảng điều khiển</p>
          <h2>Hệ thống quản lý tài sản an ninh</h2>
          <p className="banner-text">
            Giám sát camera, thiết bị kiểm soát truy cập và hệ thống cảnh báo trong một giao diện tập trung.
          </p>
        </div>
        <div className="banner-actions">
          <button className="primary-button">+ Thêm tài sản</button>
          <button className="secondary-button">Xuất báo cáo</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <span>Tổng tài sản</span>
          <strong>{stats.total}</strong>
          <small>+12% so với tháng trước</small>
        </div>
        <div className="stat-card">
          <span>Đang hoạt động</span>
          <strong>{stats.active}</strong>
          <small>Ổn định</small>
        </div>
        <div className="stat-card warning">
          <span>Bảo trì</span>
          <strong>{stats.maintenance}</strong>
          <small>Cần kiểm tra</small>
        </div>
        <div className="stat-card danger">
          <span>Hỏng</span>
          <strong>{stats.broken}</strong>
          <small>Cần xử lý</small>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Tài sản</p>
            <h2>Danh sách tài sản gần đây</h2>
          </div>
          <button className="primary-button">Xuất báo cáo</button>
        </div>

        {loading ? (
          <p className="muted-text">Đang tải dữ liệu...</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã TS</th>
                  <th>Tên thiết bị</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id || asset.asset_code}>
                    <td>{asset.asset_code}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>
                      <span className={statusMap[asset.status]?.className || 'status status-default'}>
                        {statusMap[asset.status]?.label || 'Không xác định'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
