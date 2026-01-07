import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ConnectBank from "./pages/connectBank";
import Simulate from "./pages/Simulate";
import AppLayout from "./layout/AppLayout";
import EmiTimeline from "./pages/EmiTimeline";
import LinkedAccount from "./pages/LinkedAccount";
import { runTransactionWatcher } from "./services/transactionWatcher";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();




  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<AppLayout />}>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
      path="/connect-bank"
      element={
        <ProtectedRoute>
          <ConnectBank />
        </ProtectedRoute>
      }
    />
      <Route
        path="/simulate"
        element={
          <ProtectedRoute>
            <Simulate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <LinkedAccount />
          </ProtectedRoute>
        }
      />
      <Route
      path="/timeline"
      element={
        <ProtectedRoute>
          <EmiTimeline />
        </ProtectedRoute>
      }
      />
      </Route>

    </Routes>
  );
}

export default App;
