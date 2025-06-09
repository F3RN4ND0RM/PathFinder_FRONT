import React, { useState } from "react";
import Chart from "react-apexcharts";

const StatsCard = ({ monthlyAssigned }) => {
  const [mode, setMode] = useState("month");

  // 🔥 Crear un array con 12 posiciones llenas con 0
  const monthData = Array(12).fill(0);
  monthlyAssigned?.forEach((item) => {
    const monthIndex = parseInt(item.month, 10) - 1; // Convertir a índice 0-11
    monthData[monthIndex] = item.count; // Asignar el count
  });

  const fullData = {
    month: [
      {
        name: "Assignments",
        data: monthData,
        color: "#6C3DF3",
      },
    ],
    week: [], // Si después quieres datos semanales
  };

  const xCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [activeSeries, setActiveSeries] = useState({
    Assignments: true,
  });

  const handleToggle = (name) =>
    setActiveSeries((prev) => ({ ...prev, [name]: !prev[name] }));

  const filteredSeries = fullData[mode].filter((s) => activeSeries[s.name]);

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: xCategories,
      labels: { style: { fontSize: "12px" }, offsetY: 1, rotate: 0 },
    },
    grid: { show: false, padding: { bottom: -10 } },
    colors: filteredSeries.map((s) => s.color),
    legend: { show: false },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val) => `${val}` } },
    yaxis: {
      min: 0,
      max: Math.ceil((Math.max(...monthData, 10) + 10) / 20) * 20, // 🔥 Round up to nearest multiple of 20
      tickAmount: 4, // 🔥 4 intervals for a clean scale: 0, 20, 40, 60, 80
      labels: {
        formatter: (val) => `${Math.round(val)}`, // 🔥 Round to nearest integer
        style: { fontSize: "14px" },
      },
    },
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
    >
      <div
        style={{
          padding: "2rem",
          borderRadius: "20px",
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: "800px",
          minWidth: "300px",
          overflowX: "auto",
          position: "relative",
          borderTop: "4px solid #9b4dff",
        }}
      >
        <h2
          style={{ fontSize: "20px", marginBottom: "1rem", fontWeight: "bold" }}
        >
          Monthly Assignations
        </h2>
        <Chart
          options={options}
          series={filteredSeries}
          type="bar"
          height={250}
        />
      </div>
    </div>
  );
};

export default StatsCard;
