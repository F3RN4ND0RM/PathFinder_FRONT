import React from "react";
import { Box } from "@mui/material";
import KpiCard from "./KpiCard";

const KpiGrid = ({ assigned, projects }) => {
  const KPI_DATA = [
    {
      title: "Total Employees",
      value: assigned.totalEmployees,
      percent: assigned.assignedPercentage.percentage, 
      growth: "+14%", 
    },
    {
      title: "Assigned Employees",
      value: assigned.assignedPercentage.Total, 
      percent: assigned.assignedPercentage.percentage, 
      growth: "+06%",
    },
    {
      title: "Active Projects",
      value: parseInt(projects.find(p => p.status === true)?.count || 0),
      percent: projects.find(p => p.status === true)?.promedio || 0,
      growth: "+46%",
    }
  ];

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="stretch"
      flexWrap="wrap" // ✅ CAMBIA de nowrap a wrap
      gap={2}
      sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
    >
      {KPI_DATA.map((kpi, idx) => (
        <Box
          key={idx}
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 48%", md: "1 1 30%" }, // ✅ Responsivo
            maxWidth: { xs: "100%", sm: "48%", md: "30%" },
            minWidth: "260px",
          }}
        >
          <KpiCard {...kpi} />
        </Box>
      ))}
    </Box>
  );
};

export default KpiGrid;
