import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import KpiGrid from "../components/KpiGrid";
import StatsCard from "../components/StatsCard";
import AcquisitionsCard from "../components/AcquisitionsCard";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const API_BACK = process.env.REACT_APP_API_URL; 
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // 🔑 Token dinámico guardado por login
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    fetch(`${API_BACK}/data`, {
      method: "GET",
      headers: { token },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("BACKEND DATA:", json); // 🔥 Aquí agregamos el console.log
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch((err) => {
        setError("Failed to fetch data");
        console.error(err);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
    <div className="spinner-border text-primary"  role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
   
  </div>
);

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f4f6f8", minHeight: "100vh" }}
    >
      <KpiGrid assigned={data.Assigned} />
      <Box
        mt={4}
        display="flex"
        gap={3}
        flexWrap="nowrap"
        alignItems="flex-start"
      >
        <Box flexGrow={1}>
          <StatsCard monthlyAssigned={data.monthlyAssigned} />
        </Box>
        <Box width="300px">
          <AcquisitionsCard courses={data.coursesByPopularity} />
        </Box>
      </Box>
    </Box>
  );
}
