import React from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { TrendingUp, MoreVert } from "@mui/icons-material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

// 🎨 Colores más vibrantes
const getKpiColor = (title) => {
  switch (title) {
    case "Total Employees":
      return "#7e3ff2"; // Morado
    case "Assigned Employees":
      return "#38b2ac";
    case "Unassigned":
      return "#60a5fa";
    default:
      return "#7e57c2"; // Fallback
  }
};

const KpiCard = ({ title, value, percent, growth }) => {
  const color = getKpiColor(title);
  const bgColor = `${color}20`; // Fondo claro
  const controls = useAnimationControls();

  // 🎯 Animar progresivamente desde 0 hasta el valor final
  const [animatedPercent, setAnimatedPercent] = React.useState(0);

  useEffect(() => {
    controls.start({ percent: percent });
    const interval = setInterval(() => {
      setAnimatedPercent((prev) => {
        if (prev < percent) return prev + 1;
        clearInterval(interval);
        return percent;
      });
    }, 10); // Cambia la velocidad si lo deseas
    return () => clearInterval(interval);
  }, [percent, controls]);

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
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: "1rem",
          padding: "2rem",
          borderRadius: "20px",
          backgroundColor: "#fff",
          height: "200px",
          width: "100%",
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.05)" },
          borderTop: "4px solid #9b4dff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "gray",
          }}
        >
          <MoreVert />
        </IconButton>

        <Box
          sx={{
            flex: "0 0 180px",
            minWidth: 180,
            maxWidth: 180,
          }}
        >
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

          <Box display="flex" alignItems="center" mt={2}>
            <Box
              sx={{
                backgroundColor: bgColor,
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 0.5,
              }}
            >
              <TrendingUp sx={{ color: color, fontSize: 16 }} />
            </Box>
            <Typography variant="body2" color={color} fontWeight="bold">
              {growth} Inc
            </Typography>
          </Box>
        </Box>

        {/* 🔥 Circular Progress animado */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
            width: 90,
            height: 120,
            ml: 0.5,
            transform: "translateX(10px)",
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
              top: "62%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: "800",
                color: color,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1,
              }}
            >
              +{percent}%
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default KpiCard;
