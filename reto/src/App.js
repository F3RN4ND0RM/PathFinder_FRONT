import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { UserProvider } from "./helpers/UserContext";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import CareerPath from "./Pages/CareerPath";
import Assignation from "./Pages/Assignation";
import EditProfile from "./Pages/EditProfile";
import Profile from "./Pages/Profile";
import Courses from "./Pages/Courses";
import LoginPage from "./Pages/Login";
import Recommendations from "./Pages/Recommendations";
import HomePage from "./Pages/Homepage";
import { AllCourses } from "./Pages/AllCourses";
import CreateProjectPage from "./Pages/CreateProject";
import ProjectDetail from "./Pages/ProjectDetail";

// 🔒 AUTH WRAPPER CORREGIDO
function AuthWrapper({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setToken(token);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("authToken");
      if (newToken) {
        setToken(newToken);
      } else {
        setToken(null);
        navigate("/"); // Redirige si el token se elimina
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  useEffect(() => {
    if (!checkingAuth && !token && window.location.pathname !== "/") {
      navigate("/");
    }
  }, [token, checkingAuth, navigate]);

  if (checkingAuth) return null; // o puedes mostrar un spinner aquí

  return children;
}

// APP PRINCIPAL
function App() {
  return (
    <Router>
      <UserProvider>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/career"
              element={
                <Layout>
                  <CareerPath />
                </Layout>
              }
            />
            <Route
              path="/allcourses"
              element={
                <Layout>
                  <AllCourses/>
                </Layout>
              }
            />
            <Route
              path="/assignation"
              element={
                <Layout>
                  <Assignation />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
             <Route
              path="/createproject"
              element={
                <Layout>
                  <CreateProjectPage/>
                </Layout>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <Layout>
                  <EditProfile />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout>
                  <Courses />
                </Layout>
              }
            />
            <Route
              path="/recommendations"
              element={
                <Layout>
                  <Recommendations />
                </Layout>
              }
            />
            <Route
              path="/Home"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route 
              path="/assignation/project/:id"
              element={
                <Layout>
                  <ProjectDetail />
                </Layout>
              }
            />
          </Routes>
        </AuthWrapper>
      </UserProvider>
    </Router>
  );
}

export default App;