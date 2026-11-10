import { useMemo, useState } from 'react';

const initialAssets = [
  {
    id: 1,
    asset_code: 'CAM-001',
    name: 'Camera an ninh sảnh chính',
    category: 'Camera',
    location: 'Tầng 1 - Sảnh chính',
    status: 'active',
    purchase_date: '2024-04-10',
    warranty: '24 tháng',
    serial: 'CAM-2024-001',
    description: 'Camera giám sát ngoài trời, độ phân giải 4K.'
  },
  {
    id: 2,
    asset_code: 'ACC-001',
    name: 'Đầu đọc thẻ từ cổng A',
    category: 'Access Control',
    location: 'Cổng A - Lối vào',
    status: 'maintenance',
    purchase_date: '2023-08-15',
    warranty: '12 tháng',
    serial: 'ACC-2023-007',
    description: 'Thiết bị kiểm soát ra vào khu vực chính.'
  },
  {
    id: 3,
    asset_code: 'SEN-042',
    name: 'Cảm biến khói kho hàng',
    category: 'Sensor',
    location: 'Kho hàng - Phòng 2',
    status: 'active',
    purchase_date: '2025-01-18',
    warranty: '36 tháng',
    serial: 'SEN-2025-042',
    description: 'Hệ thống cảnh báo khói và nhiệt.'
  },
  {
    id: 4,
    asset_code: 'NET-011',
    name: 'Switch trung tâm',
    category: 'Network',
    location: 'Tủ mạng tầng 2',
    status: 'broken',
    purchase_date: '2022-11-02',
    warranty: '6 tháng',
    serial: 'NET-2022-011',
    description: 'Thiết bị trung tâm mạng đang cần thay mới.'
  },
];

const statusMap = {
  active: { label: 'Hoạt động', className: 'status status-success' },
  maintenance: { label: 'Bảo trì', className: 'status status-warning' },
  broken: { label: 'Hỏng', className: 'status status-danger' },
};

const emptyForm = {
  asset_code: '',
  name: '',
  category: 'Camera',
  location: '',
  status: 'active',
  purchase_date: '',
  warranty: '',
  serial: '',
  description: '',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssets[0].id);
  const [showModal, setShowModal] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        !search ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.asset_code.toLowerCase().includes(search.toLowerCase()) ||
        asset.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const selectedAsset =
    assets.find((asset) => asset.id === selectedAssetId) || filteredAssets[0] || null;

  const openAddModal = () => {
    setEditingAssetId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (asset) => {
    setEditingAssetId(asset.id);
    setFormData({ ...asset });
    setShowModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.asset_code || !formData.name || !formData.location) {
      return;
    }

    if (editingAssetId !== null) {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === editingAssetId ? { ...asset, ...formData } : asset,
        ),
      );
    } else {
      const newAsset = {
        ...formData,
        id: Date.now(),
      };
      setAssets((prev) => [newAsset, ...prev]);
      setSelectedAssetId(newAsset.id);
    }

    setShowModal(false);
    setFormData(emptyForm);
    setEditingAssetId(null);
  };

  const handleDelete = (assetId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
    if (selectedAssetId === assetId) {
      const nextAsset = assets.find((asset) => asset.id !== assetId);
      setSelectedAssetId(nextAsset ? nextAsset.id : null);
    }
  };

  return (
    <div className="asset-page">
      <div className="panel panel-compact">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Danh mục</p>
            <h2>Quản lý tài sản</h2>
          </div>
          <button className="primary-button" onClick={openAddModal}>+ Thêm tài sản</button>
        </div>

        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo mã, tên hoặc loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="search-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="maintenance">Bảo trì</option>
            <option value="broken">Hỏng</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã TS</th>
                <th>Tên thiết bị</th>
                <th>Danh mục</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className={selectedAssetId === asset.id ? 'selected-row' : ''}
                  onClick={() => setSelectedAssetId(asset.id)}
                >
                  <td>{asset.asset_code}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.location}</td>
                  <td>
                    <span className={statusMap[asset.status]?.className || 'status status-default'}>
                      {statusMap[asset.status]?.label || 'Không xác định'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="table-button ghost-button" onClick={(e) => { e.stopPropagation(); openEditModal(asset); }}>Sửa</button>
                      <button className="table-button danger-button" onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAsset && (
        <div className="panel detail-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Chi tiết</p>
              <h2>{selectedAsset.name}</h2>
            </div>
            <button className="primary-button" onClick={() => openEditModal(selectedAsset)}>Sửa thông tin</button>
          </div>

          <div className="detail-grid">
            <div><span>Mã tài sản</span><strong>{selectedAsset.asset_code}</strong></div>
            <div><span>Phân loại</span><strong>{selectedAsset.category}</strong></div>
            <div><span>Vị trí</span><strong>{selectedAsset.location}</strong></div>
            <div><span>Trạng thái</span><strong>{statusMap[selectedAsset.status]?.label || 'Không xác định'}</strong></div>
            <div><span>Ngày mua</span><strong>{selectedAsset.purchase_date || 'Chưa cập nhật'}</strong></div>
            <div><span>Bảo hành</span><strong>{selectedAsset.warranty || 'Chưa cập nhật'}</strong></div>
            <div><span>Số serial</span><strong>{selectedAsset.serial || 'Chưa cập nhật'}</strong></div>
          </div>

          <div className="detail-description">
            <h3>Mô tả</h3>
            <p>{selectedAsset.description || 'Chưa có mô tả cho thiết bị này.'}</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Thiết bị</p>
                <h2>{editingAssetId ? 'Cập nhật tài sản' : 'Thêm tài sản mới'}</h2>
              </div>
              <button className="icon-button" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="asset-form">
              <div className="field-grid">
                <label>
                  Mã tài sản
                  <input name="asset_code" value={formData.asset_code} onChange={handleInputChange} required />
                </label>
                <label>
                  Tên thiết bị
                  <input name="name" value={formData.name} onChange={handleInputChange} required />
                </label>
                <label>
                  Danh mục
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Camera">Camera</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Network">Network</option>
                    <option value="Security">Security</option>
                  </select>
                </label>
                <label>
                  Trạng thái
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="broken">Hỏng</option>
                  </select>
                </label>
                <label>
                  Vị trí
                  <input name="location" value={formData.location} onChange={handleInputChange} required />
                </label>
                <label>
                  Số serial
                  <input name="serial" value={formData.serial} onChange={handleInputChange} />
                </label>
                <label>
                  Ngày mua
                  <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleInputChange} />
                </label>
                <label>
                  Bảo hành
                  <input name="warranty" value={formData.warranty} onChange={handleInputChange} />
                </label>
              </div>

              <label>
                Mô tả
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" />
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="primary-button">{editingAssetId ? 'Lưu thay đổi' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
