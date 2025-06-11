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
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <KpiGrid assigned={data.Assigned} projects={data.Projects}/>

        <Box
          mt={4}
          display="flex"
          flexWrap="wrap"
          gap={4}
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 65%" },
              maxWidth: { xs: "100%", md: "65%" },
              minWidth: "280px",
            }}
          >
            <StatsCard monthlyAssigned={data.monthlyAssigned} />
          </Box>

          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 32%" },
              maxWidth: { xs: "100%", md: "32%" },
              height: "100%",
            }}
          >
            <AcquisitionsCard courses={data.coursesByPopularity} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
