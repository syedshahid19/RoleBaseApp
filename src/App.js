import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

// Lazy Loading Components
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() =>
  import("./components/core/Dashboard/AdminDashboard/AdminDashboard")
);
const UserDashboard = lazy(() =>
  import("./components/core/Dashboard/UserDashboard/UserDashboard")
);
const AdminHome = lazy(() =>
  import("./components/core/Dashboard/AdminDashboard/AdminHome")
);
const ManualLeadEntry = lazy(() =>
  import("./components/core/Dashboard/UserDashboard/ManualLeadEntry")
);
const BulkUpload = lazy(() => import("./components/common/BulkUpload"));
const CreateVendorForm = lazy(() =>
  import("./components/core/Dashboard/VendorDashboard/CreateVendorForm")
);
const VendorDashboard = lazy(() =>
  import("./components/core/Dashboard/VendorDashboard/VendorDashboard")
);
const MonitorCommission = lazy(() =>
  import("./components/core/Dashboard/VendorDashboard/MonitorCommission")
);
const VendorHome = lazy(() =>
  import("./components/core/Dashboard/VendorDashboard/VendorHome")
);
const CommissionSettings = lazy(() =>
  import("./components/core/Dashboard/AdminDashboard/CommissionSettings")
);

const LoadingFallback = () => (
  <div className="text-white text-lg">Loading...</div> //fallback for lazy-loaded components
);

function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-richblack-900  font-inter">
      <div className="flex items-center justify-center">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Default Route to Login */}
            <Route path="/" element={<Navigate replace to="/login" />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Admin Dashboard with Protected Routes */}
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
              <Route path="commission" element={<CommissionSettings />} />
              <Route path="bulk-upload" element={<BulkUpload />} />
            </Route>

            {/* Vendor Dashboard with Protected Routes */}
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Vendor"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            >
              {/* Nested Routes for vendor */}
              <Route index element={<VendorHome />} />
              <Route path="vendors-creation" element={<CreateVendorForm />} />
              <Route
                path="monitor-commission"
                element={<MonitorCommission />}
              />
            </Route>

            {/* User Dashboard with Protected Routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              {/* User Nested Route */}
              <Route index element={<ManualLeadEntry />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={<div className="text-white">404 - Page Not Found</div>}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
