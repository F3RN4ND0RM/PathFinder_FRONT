import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";

// Función para asignar colores automáticamente
const getColor = (index) => {
  const colors = ["#6C3DF3", "#38b2ac", "#60a5fa", "#C7C7FF", "#34D399"];
  return colors[index % colors.length];
};

const AcquisitionsCard = ({ courses }) => {
  // Mapea los datos del backend para el componente
  const acquisitionData = courses
    .map((course, index) => ({
      name: course.Course.name, // Nombre del curso
      count: Number(course.count_course), // Número de personas que tomaron el curso
      color: getColor(index),
    }))
    .slice(0, 5); // ✅ Mostrar solo los primeros 5 cursos

  // 🔥 Calcular el máximo para normalizar
  const maxCount = Math.max(...acquisitionData.map((c) => c.count), 1); // Evitar división por 0

  const [animatedCounts, setAnimatedCounts] = useState(
    acquisitionData.map(() => 0)
  );

  useEffect(() => {
    const intervals = acquisitionData.map((item, index) => {
      return setInterval(() => {
        setAnimatedCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[index] < item.count) {
            newCounts[index] += 1;
          } else {
            clearInterval(intervals[index]);
          }
          return newCounts;
        });
      }, 20);
    });
    return () => intervals.forEach((int) => clearInterval(int));
  }, [courses]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "1.5rem",
          borderRadius: "20px",
          backgroundColor: "#fff",
          width: "100%",
          minHeight: "400px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderTop: "4px solid #9b4dff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Courses By Popularity
          </Typography>
        </Box>

        {acquisitionData.map((item, index) => (
          <Box key={index} mb={1.5}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {animatedCounts[index]} {/* Mostrar número de personas */}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                height: "6px",
                borderRadius: "4px",
                overflow: "hidden",
                mt: 0.5,
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${
                    maxCount === 0
                      ? 0
                      : Math.min((animatedCounts[index] / maxCount) * 100, 100)
                  }%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ backgroundColor: item.color, height: "100%" }}
              />
            </Box>
            {index < acquisitionData.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Paper>
    </motion.div>
  );
};

export default AcquisitionsCard;
