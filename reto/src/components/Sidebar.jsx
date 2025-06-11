import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const level = localStorage.getItem("userLevel");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userLevel");
    navigate("/");
  };

  const isManager = level === "Manager";
  const isTFS = level === "TFS";
  const isUsuario = level === "Usuario";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="sidebar-wrapper">
      <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          {!collapsed && (
            <img
              src="/img/Logo1.png"
              alt="accenture logo"
              className="accenture-logo"
            />
          )}
          <button className="internal-collapse-btn" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
        </div>

        <ul className="nav flex-column w-100">
          <li className="sidebar-link-container">
            <Link to="/home" className="sidebar-link fs-5 fw-light">
              {!collapsed && "Home"}
            </Link>
          </li>
          {/* Solo TFS puede crear una cuenta */}
         

          {/* Solo Manager puede ver Dashboard */}
          {isManager && (
            <li className="sidebar-link-container">
              <Link to="/dashboard" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Dashboard"}
              </Link>
            </li>
          )}

          <li className="sidebar-link-container">
            <Link to="/career" className="sidebar-link fs-5 fw-light">
              {!collapsed && "Career Path"}
            </Link>
          </li>

          <li className="sidebar-link-container">
            <Link to="/courses" className="sidebar-link fs-5 fw-light">
              {!collapsed && "Courses"}
            </Link>
          </li>

          {/* Ocultar Assignation si es Usuario */}
          {!isUsuario && (
            <li className="sidebar-link-container">
              <Link to="/assignation" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Assignation"}
              </Link>
            </li>
          )}

          <li className="sidebar-link-container">
            <Link to="/profile" className="sidebar-link fs-5 fw-light">
              {!collapsed && "Profile"}
            </Link>
          </li>
           {isTFS && (
            <li className="sidebar-link-container">
              <Link to="/createuser" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Create User"}
              </Link>
            </li>
          )}
        </ul>
        

        <div className="logout-button-container mt-auto p-3">
          {!collapsed && (
            <button
              className="btn btn-outline-light w-100 fw-bold"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
