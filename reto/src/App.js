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
import { ProjectDetailM } from "./Pages/ProjectDetailM";

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
                <Layout
                  title="Dashboard"
                  subtitle="Insightful Metrics for Bright Ideas"
                  name={localStorage.getItem("userName") || "Usuario"}
                >
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/career"
              element={
                <Layout>
                  {(collapsed, setCollapsed) => (
                    <CareerPath
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  )}
                </Layout>
              }
            />

            <Route
              path="/courses"
              element={
                <Layout
                  title="Your Learning Journey Starts Here!"
                  subtitle="Pick up where you left off and continue growing your skills!"
                  name={localStorage.getItem("userName") || "Usuario"}
                >
                  <Courses />
                </Layout>
              }
            />

            <Route
              path="/assignation"
              element={
                <Layout
                  title={
                    {
                      TFS: "TFS Dashboard – Manage Your Teams",
                      Manager: "Manager View – Oversee Project Assignments",
                    }[localStorage.getItem("userLevel")] ||
                    "Assignation Overview"
                  }
                  subtitle={
                    {
                      Usuario:
                        "Here are your current project responsibilities and teams.",
                      TFS: "Track staff assignments and project distribution in real time.",
                      Manager:
                        "Access insights into all employee assignments and statuses.",
                    }[localStorage.getItem("userLevel")] || ""
                  }
                  name={localStorage.getItem("userName") || "Usuario"}
                >
                  <Assignation />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  {(collapsed, setCollapsed) => (
                    <Profile
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  )}
                </Layout>
              }
            />

            <Route
              path="/createproject"
              element={
                <Layout>
                  <CreateProjectPage />
                </Layout>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <Layout>
                  {(collapsed, setCollapsed) => (
                    <EditProfile
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  )}
                </Layout>
              }
            />

            <Route
              path="/allcourses"
              element={
                <Layout
                  title="Explore All Courses"
                  subtitle="Browse a variety of learning opportunities to boost your career"
                  name={localStorage.getItem("userName") || "Usuario"}
                >
                  <AllCourses />
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
              path="/home"
              element={
                <Layout
                  title={`Welcome, ${
                    localStorage.getItem("userName") || "Usuario"
                  }`}
                  subtitle="Check your notifications and active certifications"
                  name={localStorage.getItem("userName") || "Usuario"}
                >
                  <HomePage />
                </Layout>
              }
            />

            <Route
              path="/assignation/project/:id"
              element={
                <ProjectDetail/>
              }
            />

            <Route
              path="/assignation/project/manager/:id"
              element={
                <ProjectDetailM />
              }
            />
          </Routes>
        </AuthWrapper>
      </UserProvider>
    </Router>
  );
}

export default App;
