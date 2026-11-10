const logs = [
  { id: 1, title: 'Kiểm tra camera sảnh chính', date: '08/11/2026', technician: 'Nguyễn A', status: 'done' },
  { id: 2, title: 'Bảo dưỡng đầu đọc thẻ cổng A', date: '07/11/2026', technician: 'Trần B', status: 'pending' },
  { id: 3, title: 'Sửa cảm biến khói kho hàng', date: '05/11/2026', technician: 'Lê C', status: 'in-progress' },
];

const statusLabels = {
  done: 'Hoàn tất',
  pending: 'Chờ xử lý',
  'in-progress': 'Đang xử lý',
};

export default function MaintenancePage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Bảo trì</p>
          <h2>Nhật ký bảo trì</h2>
        </div>
        <button className="primary-button">+ Tạo lịch</button>
      </div>

      <div className="log-list">
        {logs.map((log) => (
          <div key={log.id} className="log-item">
            <div>
              <h3>{log.title}</h3>
              <p>{log.date} • {log.technician}</p>
            </div>
            <span className={`status ${
              log.status === 'done' ? 'status-success' :
              log.status === 'pending' ? 'status-warning' : 'status-default'
            }`}>
              {statusLabels[log.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
