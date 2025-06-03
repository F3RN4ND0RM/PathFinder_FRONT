import React from "react";

export default function SidebarExpandButton({ setCollapsed }) {
  const handleClick = () => {
    localStorage.setItem("sidebarOpen", "true");
    setCollapsed(false);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.06)", // Light grey background
        color: "#9b4dff", // Purple arrow
        border: "none",
        fontSize: "3rem", // Bigger size
        fontWeight: "900",
        cursor: "pointer",
        transform: "rotate(-10deg)",
        marginRight: "1rem",
        padding: "0.4rem 1.2rem", // Bigger hitbox
        lineHeight: "1",
        borderRadius: "10px", // Rounded shape
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
    >
      &gt;
    </button>
  );
}
