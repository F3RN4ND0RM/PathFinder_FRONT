import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const level = localStorage.getItem("userLevel"); // "Usuario", "TFS", or "Manager"
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userLevel");
    navigate("/");
  };

  const isAdvancedUser = level === "TFS" || level === "Manager";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Botón FLOTANTE solo cuando está colapsada */}
      {collapsed && (
        <button className="floating-collapse-btn" onClick={toggleSidebar}>
          &gt;
        </button>
      )}

      <div className="sidebar-wrapper">
        <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
          {/* Botón DENTRO de la sidebar cuando está expandida */}
          {!collapsed && (
            <div className="sidebar-top">
              <button className="internal-collapse-btn" onClick={toggleSidebar}>
                &lt;
              </button>
              <img
                src="/img/Logo1.png"
                alt="accenture logo"
                className="accenture-logo"
              />
            </div>
          )}

          <ul className="nav flex-column w-100">
            <li className="sidebar-link-container">
              <Link to="/home" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Home"}
              </Link>
            </li>
            {isAdvancedUser && (
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
            <li className="sidebar-link-container">
              <Link to="/assignation" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Assignation"}
              </Link>
            </li>
            <li className="sidebar-link-container">
              <Link to="/profile" className="sidebar-link fs-5 fw-light">
                {!collapsed && "Profile"}
              </Link>
            </li>
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
    </>
  );
}

export default Sidebar;
