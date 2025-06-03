// ProjectTimeline.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { motion, useInView } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TimelineIcon from "@mui/icons-material/Timeline";

const API_URL = process.env.REACT_APP_API_URL;

const ProjectTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, {
    triggerOnce: true,
    margin: "-100px",
  });

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token no encontrado. Inicia sesión.");

        const res = await fetch(`${API_URL}/employees/timeline`, {
          headers: { "Content-Type": "application/json", token },
        });

        if (!res.ok) throw new Error("Respuesta HTTP " + res.status);

        const data = await res.json();
        console.log("API RESPONSE:", data);

        const courseEvents = Array.isArray(data.coursesOfEmployee)
          ? data.coursesOfEmployee.map((course) => ({
              date: course.Courseinfo?.updatedAt?.split("T")[0] || "N/A",
              label: `Curso: ${course.name}`,
              icon: <SchoolIcon fontSize="medium" />,
              color: "#42a5f5",
            }))
          : [];

        const roleEvents = Array.isArray(data.rolesOfEmployee)
          ? data.rolesOfEmployee.map((role) => ({
              date: role.Assigned?.createdAt?.split("T")[0] || "N/A",
              label: `Rol: ${role.name}`,
              icon: <WorkIcon fontSize="medium" />,
              color: "#7e57c2",
            }))
          : [];

        // Sort events by date (newest first)
        const allEvents = [...roleEvents, ...courseEvents].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  return (
    <Box
      ref={timelineRef}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        padding: 3,
       boxShadow: "0 4px 20px rgba(123, 31, 162, 0.1)",
        borderTop: "4px solid",
        borderColor: "#a777e3",
        marginTop: 2,
        overflowX: "auto",
        minHeight: 300,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TimelineIcon sx={{ 
          color: '#a777e3', // Color morado específico
          fontSize: '2.5rem' // Tamaño adicional si lo necesitas
        }} />
              <h5>Timeline</h5>
      </Box>
      
      <LinearProgress 
        color="primary" 
        sx={{ 
          height: 2, 
          width: 60, 
          mb: 3, 
          color: '#a777e3', // Color morado específico
          borderRadius: 2,
          opacity: 0.8 
        }} 
      />

      {loading ? (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          color: '#a777e3' ,
          justifyContent: "center", 
          height: 200 
        }}>
          <LinearProgress color="primary" sx={{ width: '100%', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Cargando línea de tiempo...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          bgcolor: "error.light", 
          color: "error.contrastText", 
          p: 2, 
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}>
          <ErrorOutlineIcon />
          <Typography variant="body1">{error}</Typography>
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          height: 200,
          textAlign: "center"
        }}>
          <Typography variant="body1" color="text.secondary">
            Nothing found in your timeline yet.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 4,
          py: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: 3,
          }
        }}>
          {events.map((ev, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    minWidth: 160,
                    bgcolor: "background.default",
                    borderRadius: 3,
                    p: 2,
                    boxShadow: 1,
                    border: "2px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                      borderColor: ev.color,
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: ev.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "common.white",
                      mx: "auto",
                      mb: 1.5,
                      boxShadow: `0 4px 12px ${ev.color}40`,
                    }}
                  >
                    {ev.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {ev.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    {ev.date}
                  </Typography>
                </Box>
              </motion.div>

              {i < events.length - 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "60px" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${events[i].color}, ${events[i+1].color})`,
                      opacity: 0.7,
                    }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProjectTimeline;