import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import DashboardPage from './pages/DashboardPage';
import LiveMapPage from './pages/LiveMapPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import DeliveryTimelinePage from './pages/DeliveryTimelinePage';
import DelayAnalysisPage from './pages/DelayAnalysisPage';
import PODPage from './pages/PODPage';
import FleetManagementPage from './pages/FleetManagementPage';
import MaintenancePage from './pages/MaintenancePage';
import SalesViewPage from './pages/SalesViewPage';
import KPIReportPage from './pages/KPIReportPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map" element={<LiveMapPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/timeline" element={<DeliveryTimelinePage />} />
          <Route path="/delay" element={<DelayAnalysisPage />} />
          <Route path="/pod" element={<PODPage />} />
          <Route path="/fleet" element={<FleetManagementPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/sales" element={<SalesViewPage />} />
          <Route path="/kpi" element={<KPIReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
