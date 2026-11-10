import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import AssetsPage from './pages/AssetsPage';
import ScannerPage from './pages/ScannerPage';
import MaintenancePage from './pages/MaintenancePage';

const navItems = [
  { to: '/', label: 'Tổng quan', icon: '🏠' },
  { to: '/assets', label: 'Quản lý Tài sản', icon: '📦' },
  { to: '/scan', label: 'Quét QR', icon: '📷' },
  { to: '/maintenance', label: 'Nhật ký bảo trì', icon: '🛠️' },
];

function App() {
  return (
    <Router>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">S</span>
            Tài sản An ninh
          </div>

          <nav className="nav-menu">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-pill">
              <span className="user-avatar">A</span>
              <div>
                <strong>Quản trị viên</strong>
                <small>Trực tuyến</small>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Hệ thống</p>
              <h1>Tổng quan</h1>
            </div>
            <div className="topbar-actions">
              <button className="icon-button">🔔</button>
              <button className="icon-button">⚙️</button>
            </div>
          </header>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/scan" element={<ScannerPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
