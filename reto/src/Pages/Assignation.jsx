import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TfsView } from "../components/TfsView";
import { ManagerView } from "../components/ManagerView";

export default function Assignation() {
  const level = localStorage.getItem("userLevel");
  const navigate = useNavigate();

  useEffect(() => {
    if (level === "Usuario") {
      navigate("/home"); // 🔁 redirect if not authorized
    }
  }, [level, navigate]);

  if (level === "TFS") {
    return <TfsView />;
  }

  if (level === "Manager") {
    return <ManagerView />;
  }

  return null; // or a loading spinner if desired
}
