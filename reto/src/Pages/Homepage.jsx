import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import CertificationCard from "../components/CertificationCard";
import Projects from "../components/Projects";
import "../styles/HomePage.css";

const HomePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [certs, setCerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState(localStorage.getItem("userName") || "Usuario");

  useEffect(() => {
    fetchUserName(); // Obtener el nombre
    fetchCertifications();
    fetchProjects();
  }, []);

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://pathfinder-back-hnoj.onrender.com/employees/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el nombre del usuario");

      const data = await response.json();
      if (!data.error && data.name) {
        localStorage.setItem("userName", data.name);
        setName(data.name);
      }
    } catch (error) {
      console.error("Error obteniendo el nombre de usuario:", error);
    }
  };

  const fetchCertifications = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("https://pathfinder-back-hnoj.onrender.com/employees/certifications", {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();
      const certsData = data.certificationsOfEmployee.map((cert) => ({
        id: cert.id,
        name: cert.name,
        description: cert.description,
        expiration: cert.Certinfo.expiration,
      }));

      setCerts(certsData);

      const now = new Date();
      const expiringSoon = certsData.filter((cert) => {
        const expirationDate = new Date(cert.expiration);
        const diffDays = (expirationDate - now) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });

      if (expiringSoon.length > 0) {
        const newNotifs = expiringSoon.map(
          (c) => `The certification "${c.name}" is expiring soon`
        );
        setNotifications(newNotifs);
      }
    } catch (error) {
      console.error("Error obteniendo certificaciones:", error);
      setNotifications(["Hubo un error al cargar las certificaciones"]);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const apiUrl = new URL("https://pathfinder-back-hnoj.onrender.com/employees/projects");
      apiUrl.searchParams.append("status", "true"); // Solo proyectos activos

      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const formattedProjects = data.rolesOfEmployee.map((role) => ({
        id: role.id,
        name: role.Project.name,
        platform: role.name, // Rol como "plataforma"
        percentage: role.Assigned?.status ? 50 : 0,
        status: role.Project.status,
      }));

      const activeProjects = formattedProjects.filter((project) => project.status);
      setProjects(activeProjects);
    } catch (error) {
      console.error("Error obteniendo proyectos:", error);
    }
  };

  //id_9
  //Funcion para obtener la lista de certificaciones desde el backend (GET /certifications).
  // Esta llamada debe ejecutarse al cargar el componente Notifications con la condicion de que la fecha de expirarcion sea menor a 7 dias.
  return (
    <>
      <Header
        title={`Welcome, ${name}`}
        subtitle="Check your notifications and active certifications"
        notifications={notifications}
      />

      <Container className="homepage-container fade-in">
        <Row className="mt-4">
          <Col>
            <Projects projects={projects} />
          </Col>
        </Row>

        <Row className="mt-4">
          <h4 className="mb-3">Certifications</h4>
          {certs.map((cert) => (
            <Col key={cert.id} md={6} className="mb-3">
              <CertificationCard
                name={cert.name}
                description={cert.description}
                expiration={cert.expiration}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
// id_8
// Función para obtener la lista de cursos recomendados desde el backend (GET /courses).
// Esta llamada debe ejecutarse al cargar el componente CourseCard y actualizar el estado de cursos.
// Función para agregar un curso al perfil del usuario (POST).
// Se llamará cuando el usuario haga clic en el botón "Add".