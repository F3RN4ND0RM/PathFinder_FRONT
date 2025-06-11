import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";

const getKpiColor = (title) => {
  switch (title) {
    case "Total Employees":
      return "#7e3ff2";
    case "Assigned Employees":
      return "#38b2ac";
    case "Unassigned":
      return "#60a5fa";
    default:
      return "#7e57c2";
  }
};

const KpiCard = ({ title, value, percent, growth }) => {
  const color = getKpiColor(title);
  const bgColor = `${color}20`;

  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPercent((prev) => {
        if (prev < percent) return prev + 1;
        clearInterval(interval);
        return percent;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [percent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center", // ✅ centrado vertical
          justifyContent: "space-between", // ✅ separación entre info y círculo
          gap: "1rem",
          padding: "1.5rem",
          borderRadius: "20px",
          backgroundColor: "#fff",
          height: "200px",
          width: "100%",
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.03)" },
          borderTop: "4px solid #9b4dff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              fontSize: "1.1rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: "1.8rem" }}
            mt={1}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 90,
            height: 90,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgressbar
            value={animatedPercent}
            styles={buildStyles({
              pathColor: color,
              trailColor: "#f0f0f0",
              strokeLinecap: "round",
              strokeWidth: 14,
            })}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "800",
                color: color,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1,
              }}
            >
              {percent}%
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default KpiCard;
