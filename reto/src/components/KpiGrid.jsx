import React from "react";
import { Box } from "@mui/material";
import KpiCard from "./KpiCard";

const KpiGrid = ({ assigned }) => {
  const KPI_DATA = [
    {
      title: "Total Employees",
      value: assigned.totalEmployees, // 👈 totalEmployees ya es número
      percent: assigned.assignedPercentage.percentage, // 👈 usamos percentage
      growth: "+14%", // Puedes ajustar dinámicamente si quieres
    },
    {
      title: "Assigned Employees",
      value: assigned.assignedPercentage.Total, // 👈 usamos Total
      percent: assigned.assignedPercentage.percentage, // 👈 usamos percentage
      growth: "+06%",
    },
    {
      title: "Unassigned",
      value: assigned.unassignedPercentage.Total, // 👈 usamos Total
      percent: assigned.unassignedPercentage.percentage, // 👈 usamos percentage
      growth: "+46%",
    },
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
