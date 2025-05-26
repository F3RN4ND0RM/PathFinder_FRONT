import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { TimelineDot } from "@mui/lab";

const ProjectTimeline = () => {
  const theme = useTheme();

  const events = [
    { date: "Sep 2023", label: "Start Project A" },
    { date: "Dec 2023", label: "First Release" },
    { date: "Feb 2024", label: "Added Features" },
    { date: "Apr 2024", label: "Testing Phase" },
    { date: "May 2024", label: "Launch" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9", // como el fondo de profile-info-box
        borderRadius: "10px",
        padding: "1.5rem",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
        borderTop: "4px solid #a404fc", // color morado principal
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Header solo con subrayado morado */}
      <Box sx={{ padding: "1rem 1rem 0.5rem 1rem" }}>
        <Typography
          variant="h6"
          sx={{
            display: "inline-block",
            fontWeight: 600,
            color: "#2d2d2d",
            borderBottom: "3px solid #9b4dff",
            paddingBottom: "0.25rem",
          }}
        >
          Project Timeline
        </Typography>
      </Box>

      {/* Línea horizontal de eventos */}
      <Box
        sx={{
          padding: "1rem",
          overflowX: "auto",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {events.map((event, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "150px",
              position: "relative",
            }}
          >
            <Typography
              variant="body2"
              sx={{ marginBottom: "0.5rem", color: "#757575" }}
            >
              {event.date}
            </Typography>
            <TimelineDot color="secondary" />
            <Typography
              variant="body1"
              sx={{ marginTop: "0.5rem", fontWeight: 500 }}
            >
              {event.label}
            </Typography>
            {index < events.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "22px",
                  right: "-75px",
                  width: "150px",
                  height: "2px",
                  backgroundColor: theme.palette.secondary.main,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProjectTimeline;
