import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import Inventory from './pages/Inventory/AdminInventory';
import Reports from './pages/Report/AdminReports';
import Settings from './pages/Settings/Settings';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import EmployeeInventory from './pages/Inventory/EmployeeInventory';
import EmployeeReports from './pages/Report/EmployeeReports';


function App() {
  return (
    <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn/>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/usermanagement" element={<UserManagement />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Employee */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/inventory" element={<EmployeeInventory />} />
          <Route path="/employee/reports" element={<EmployeeReports />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;