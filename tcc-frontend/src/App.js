import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import AuthService from './auth/AuthService';

// Placeholder components for now
import ConsignmentList from './pages/ConsignmentList';
import ConsignmentDetails from './pages/ConsignmentDetails';
import TruckList from './pages/TruckList';
import TruckDetails from './pages/TruckDetails';
import BranchList from './pages/BranchList';
import BranchDetails from './pages/BranchDetails';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetails from './pages/InvoiceDetails';
// eslint-disable-next-line no-unused-vars
import DispatchList from './pages/DispatchList';
// eslint-disable-next-line no-unused-vars
import DispatchDetails from './pages/DispatchDetails';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';

const PrivateRoute = ({ children }) => {
  const currentUser = AuthService.getCurrentUser();
  return currentUser ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const Home = () => {
  const currentUser = AuthService.getCurrentUser();
  return currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/consignments"
          element={
            <PrivateRoute>
              <ConsignmentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/consignments/:consignmentId"
          element={
            <PrivateRoute>
              <ConsignmentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/trucks"
          element={
            <PrivateRoute>
              <TruckList />
            </PrivateRoute>
          }
        />
        <Route
          path="/trucks/:truckId"
          element={
            <PrivateRoute>
              <TruckDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <PrivateRoute>
              <BranchList />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <InvoiceList />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices/:invoiceId"
          element={
            <PrivateRoute>
              <InvoiceDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <PrivateRoute>
              <BranchList />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches/:branchId"
          element={
            <PrivateRoute>
              <BranchDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispatches"
          element={
            <PrivateRoute>
              <DispatchList />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispatches/:dispatchId"
          element={
            <PrivateRoute>
              <DispatchDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              <UserDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;