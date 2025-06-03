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
      flexWrap="nowrap"
      gap={0.5}
      sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
    >
      {KPI_DATA.map((kpi, idx) => (
        <Box key={idx} flex="0 0 30%" maxWidth="30%">
          <KpiCard {...kpi} />
        </Box>
      ))}
    </Box>
  );
};

export default KpiGrid;
