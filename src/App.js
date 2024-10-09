import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./components/core/Dashboard/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/core/Dashboard/UserDashboard/UserDashboard";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import AdminHome from "./components/core/Dashboard/AdminDashboard/AdminHome";
import ManualLeadEntry from "./components/core/Dashboard/UserDashboard/ManualLeadEntry";
import BulkUpload from "./components/common/BulkUpload";
import CreateVendorForm from "./components/core/Dashboard/VendorDashboard/CreateVendorForm";
import VendorDashboard from "./components/core/Dashboard/VendorDashboard/VendorDashboard"
import TrackingPerformance from "./components/core/Dashboard/VendorDashboard/TrackingPerformance";
import MonitorCommission from "./components/core/Dashboard/VendorDashboard/MonitorCommission"
import VendorHome from "./components/core/Dashboard/VendorDashboard/VendorHome"



function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-richblack-900 font-inter">
      <div className="flex items-center justify-center">
        <Routes>
          {/* Default Route to Login */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* Login and Signup Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
            >
            {/* Nested Routes for Admin */}
            <Route index element={<AdminHome />} />
            <Route path="commission" element={<div>Commission</div>} />
            <Route path="reports" element={<div>Reports</div>} />
            <Route path="bulk-upload" element={<BulkUpload/>} />
          </Route>


            <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Vendor"]}>
                <VendorDashboard/>
              </ProtectedRoute>
            }
            >
            {/* Nested Routes for Admin */}
            <Route index element={<VendorHome />} />
            <Route path="vendors-creation" element={<CreateVendorForm/>} />
            <Route path="Tracking-Performance" element={<TrackingPerformance/>} />
            <Route path="monitor-commission" element={<MonitorCommission/>} />
          </Route>


          <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes for Admin */}
          <Route index element={<ManualLeadEntry />} />
          <Route path="Transaction-history" element={<div>Transaction</div>} />
        </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
