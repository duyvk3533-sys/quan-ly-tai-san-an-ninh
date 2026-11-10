import { useEffect, useRef, useState } from 'react';

const recentScansSeed = [
  { code: 'CAM-001', name: 'Camera an ninh sảnh chính', time: '08:15', status: 'Đã xác minh' },
  { code: 'ACC-001', name: 'Đầu đọc thẻ từ cổng A', time: '08:42', status: 'Cần kiểm tra' },
  { code: 'SEN-042', name: 'Cảm biến khói kho hàng', time: '09:10', status: 'Đã xác minh' },
];

const scanStats = [
  { label: 'Tổng quét', value: '256', tone: 'blue' },
  { label: 'Đã xác minh', value: '188', tone: 'green' },
  { label: 'Cần kiểm tra', value: '12', tone: 'amber' },
];

const scanCatalog = {
  'CAM-001': { code: 'CAM-001', name: 'Camera an ninh sảnh chính', location: 'Tầng 1 - Sảnh chính', category: 'Camera', status: 'Hoạt động', verified: true },
  'ACC-001': { code: 'ACC-001', name: 'Đầu đọc thẻ từ cổng A', location: 'Cổng A - Lối vào', category: 'Access Control', status: 'Cần kiểm tra', verified: false },
  'SEN-042': { code: 'SEN-042', name: 'Cảm biến khói kho hàng', location: 'Kho hàng - Phòng 2', category: 'Sensor', status: 'Hoạt động', verified: true },
  'NET-011': { code: 'NET-011', name: 'Switch trung tâm', location: 'Tủ mạng tầng 2', category: 'Network', status: 'Bảo trì', verified: false },
};

export default function ScannerPage() {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [recentScans, setRecentScans] = useState(recentScansSeed);
  const [scanResult, setScanResult] = useState(scanCatalog['CAM-001']);
  const [capturedImage, setCapturedImage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState('Sẵn sàng quét');

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCapturedImage(previewUrl);
    setScanMessage(`Đã tải ảnh: ${file.name}`);

    const match = Object.keys(scanCatalog).find((key) => file.name.toUpperCase().includes(key));
    if (match) {
      setScanResult(scanCatalog[match]);
      const scanItem = {
        code: scanCatalog[match].code,
        name: scanCatalog[match].name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: scanCatalog[match].verified ? 'Đã xác minh' : 'Cần kiểm tra',
      };
      setRecentScans((prev) => [scanItem, ...prev.filter((item) => item.code !== scanItem.code)].slice(0, 3));
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setScanMessage('Trình duyệt không hỗ trợ camera trên máy này.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOpen(true);
      setScanMessage('Camera đang hoạt động');
    } catch (error) {
      console.error(error);
      setScanMessage('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setScanMessage('Bạn cần bật camera trước khi chụp ảnh.');
      return false;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const previewUrl = canvas.toDataURL('image/png');
    setCapturedImage(previewUrl);
    setScanMessage('Đã chụp ảnh thành công');
    return true;
  };

  const startScanWorkflow = () => {
    if (capturedImage || cameraOpen || mediaStreamRef.current) {
      const captured = capturePhoto();
      if (captured || capturedImage) {
        runScan();
        return;
      }
    }

    setScanMessage('Hãy tải lên ảnh hoặc bật camera trước khi quét.');
  };

  const runScan = () => {
    const candidates = Object.values(scanCatalog);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setScanResult(next);
    const scanItem = {
      code: next.code,
      name: next.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: next.verified ? 'Đã xác minh' : 'Cần kiểm tra',
    };
    setRecentScans((prev) => [scanItem, ...prev.filter((item) => item.code !== scanItem.code)].slice(0, 3));
    setScanMessage(`Quét xong: ${next.code}`);
  };

  return (
    <div className="scanner-page">
      <div className="stats-grid mini-grid">
        {scanStats.map((item) => (
          <div key={item.label} className={`stat-card ${item.tone}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>Hôm nay</small>
          </div>
        ))}
      </div>

      <div className="panel scanner-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">An ninh</p>
            <h2>Quét QR / mã vạch</h2>
          </div>
          <div className="scanner-actions">
            <button type="button" className="secondary-button" onClick={openFilePicker}>Tải lên</button>
            <button type="button" className="primary-button" onClick={runScan}>Quét mới</button>
          </div>
        </div>

        <div className="scanner-layout">
          <div className="scan-box-wrap">
            <div className="scan-badge online-badge">{cameraOpen ? 'Camera đang hoạt động' : 'Sẵn sàng quét'}</div>
            <div className="scan-box">
              <div className="scan-grid" />
              {capturedImage ? (
                <img src={capturedImage} alt="Ảnh chụp từ camera hoặc tải lên" className="scan-preview" />
              ) : (
                <div className="scan-frame">
                  <div className="scan-corner top-left" />
                  <div className="scan-corner top-right" />
                  <div className="scan-corner bottom-left" />
                  <div className="scan-corner bottom-right" />
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className={cameraOpen ? 'camera-video active' : 'camera-video'} />
            </div>

            <canvas ref={canvasRef} className="capture-canvas" />

            <div className="scan-toolbar">
              <button type="button" className="secondary-button" onClick={startCamera}>Chụp ảnh</button>
              <button type="button" className="primary-button" onClick={startScanWorkflow}>Bắt đầu quét</button>
            </div>
          </div>

          <div className="scan-result-card">
            <div className="result-header">
              <span className="result-badge">Kết quả mới nhất</span>
              <span className={`status ${scanResult.verified ? 'status-success' : 'status-warning'}`}>
                {scanResult.verified ? 'Đã xác minh' : 'Cần kiểm tra'}
              </span>
            </div>

            <div className="result-main">
              <h3>{scanResult.code}</h3>
              <p>{scanResult.name}</p>
            </div>

            <div className="result-meta">
              <div>
                <span>Vị trí</span>
                <strong>{scanResult.location}</strong>
              </div>
              <div>
                <span>Phân loại</span>
                <strong>{scanResult.category}</strong>
              </div>
              <div>
                <span>Trạng thái</span>
                <strong>{scanResult.status}</strong>
              </div>
            </div>

            <div className="result-actions">
              <button type="button" className="secondary-button">Xem chi tiết</button>
              <button type="button" className="primary-button">Gán tài sản</button>
            </div>
          </div>
        </div>

        <div className="scan-info">
          <div className="scan-info-header">
            <h3>Thông tin quét gần đây</h3>
            <span>{scanMessage}</span>
          </div>

          <ul className="scan-history-list">
            {recentScans.map((item) => (
              <li key={`${item.code}-${item.time}`} className="scan-history-item">
                <div>
                  <strong>{item.code}</strong>
                  <p>{item.name}</p>
                </div>
                <div className="scan-item-meta">
                  <span>{item.time}</span>
                  <em className={item.status === 'Đã xác minh' ? 'success-text' : 'warning-text'}>{item.status}</em>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </div>
  );
}
