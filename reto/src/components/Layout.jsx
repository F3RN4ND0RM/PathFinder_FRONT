import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/Layout.css";

const Layout = ({ children, name, notifications = [], title, subtitle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarOpen") !== "true";
  });

  const location = useLocation();

  const hideHeaderRoutes = [
    "/career",
    "/profile",
    "/profile/edit",
    "/recommendations",
    "/createproject",
  ];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className={`layout-container ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="layout-content">
        {!shouldHideHeader && (
          <Header
            title={title || `Welcome, ${name}`}
            subtitle={subtitle}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            notifications={notifications}
          />
        )}
        {typeof children === "function"
          ? children(collapsed, setCollapsed)
          : children}
      </div>
    </div>
  );
};

export default Layout;
