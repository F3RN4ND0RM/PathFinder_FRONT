import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap"; // ⬅️ Removed Container
import MiniCalendar from "../components/MiniCalendar";
import Header from "../components/Header";
import CertificationCard from "../components/CertificationCard";
import Projects from "../components/Projects";
import "../styles/HomePage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [collapsed, setCollapsed] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [certs, setCerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState(
    localStorage.getItem("userName") || "Usuario"
  );
  const [savedNotes, setSavedNotes] = useState(() => {
    const stored = localStorage.getItem("quickNotesList");
    if (stored) return JSON.parse(stored);
    const initial = ["Follow up with QA team", "Finish UI improvements"];
    localStorage.setItem("quickNotesList", JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    fetchUserName();
    fetchCertifications();
    fetchProjects();
  }, []);

  // ⬇️ Este es el NUEVO useEffect que necesitas
  useEffect(() => {
    const storedCourses =
      JSON.parse(localStorage.getItem("recommendedCourses")) || [];
    setRecommendedCourses(storedCourses);
  }, []);

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://pathfinder-back-hnoj.onrender.com/employees/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      if (!response.ok)
        throw new Error("Error al obtener el nombre del usuario");

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

      const response = await fetch(
        "https://pathfinder-back-hnoj.onrender.com/employees/certifications",
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

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

      const apiUrl = new URL(
        "https://pathfinder-back-hnoj.onrender.com/employees/projects"
      );
      apiUrl.searchParams.append("status", "true");

      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const formattedProjects = data.rolesOfEmployee.map((role) => ({
        id: role.id,
        name: role.Project.name,
        platform: role.name,
        percentage: role.Assigned?.status ? 50 : 0,
        status: role.Project.status,
      }));

      const activeProjects = formattedProjects.filter(
        (project) => project.status
      );
      setProjects(activeProjects);
    } catch (error) {
      console.error("Error obteniendo proyectos:", error);
    }
  };

  //id_9
  //Funcion para obtener la lista de certificaciones desde el backend (GET /certifications).
  // Esta llamada debe ejecutarse al cargar el componente Notifications con la condicion de que la fecha de expirarcion sea menor a 7 dias.
  const fixedSubtitle = "Check your notifications and active certifications";
  return (
    <>
      <Header
        title={`Welcome, ${name}`}
        subtitle={fixedSubtitle}
        notifications={notifications}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="homepage-container fade-in">
        <Row className="mt-4">
          <Col md={8}>
            <div className="projects-box">
              <Projects projects={projects} />
            </div>

            {/* ✅ Quick Notes directamente debajo de Projects */}
            <div className="notes-box mt-4">
              <h5>📝 Quick Notes</h5>
              {savedNotes.length > 0 ? (
                <ul className="saved-notes-list mt-3">
                  {savedNotes.map((note, index) => (
                    <li key={index} className="saved-note-item">
                      <i className="fas fa-sticky-note"></i>
                      <span className="note-text">{note}</span>
                      <div className="note-actions">
                        <button
                          className="note-check-btn"
                          title="Mark as done"
                          onClick={() => alert(`✔️ Marked as done: ${note}`)}
                        >
                          ✅
                        </button>
                        <button
                          className="note-delete-btn"
                          title="Delete note"
                          onClick={() => {
                            const updatedNotes = savedNotes.filter(
                              (_, i) => i !== index
                            );
                            setSavedNotes(updatedNotes);
                            localStorage.setItem(
                              "quickNotesList",
                              JSON.stringify(updatedNotes)
                            );
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#777", fontSize: "0.9rem" }}>
                  No notes available at the moment.
                </p>
              )}
            </div>
          </Col>

          <Col md={4}>
            <MiniCalendar />
          </Col>
        </Row>

        <div className="section-header-container">
          <h4 className="section-header">Certifications</h4>
        </div>

        <Row className="mt-2">
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
        {recommendedCourses.length > 0 && (
          <>
            <div className="section-header-container mt-5">
              <h4 className="section-header">Recommended Courses</h4>
            </div>
            <Swiper
              modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
              effect="coverflow"
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation
              pagination={{ clickable: true }}
              loop={false}
              centeredSlides={true}
              slidesPerView={3}
              initialSlide={1}
              spaceBetween={0}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 200,
                modifier: 2.5,
                slideShadows: false,
              }}
            >
              {recommendedCourses.map((course, index) => (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <div
                      className={`course-card ${isActive ? "active" : ""}`}
                      style={{
                        backgroundImage: `url("img/${
                          decodeURIComponent(course.imgUrl) || "default.jpg"
                        }")`,
                      }}
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowModal(true);
                      }}
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="course-detail-modal"
      >
        <Modal.Body>
          <div className="course-detail-layout">
            <div className="course-info">
              <h1 className="course-title">{selectedCourse?.name}</h1>
              <p className="course-description-text">
                {selectedCourse?.description}
              </p>
              <div className="course-extra">
                <p>
                  <strong>Created by:</strong>{" "}
                  {selectedCourse?.instructor || "Unknown"}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {selectedCourse?.language || "English"}
                </p>
              </div>
              <div className="rating-stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">☆</span>
                <span className="rating-number">(4.0)</span>
              </div>
              <p className="preview-text">Preview this course</p>
            </div>

            <div className="course-image-container">
              <div className="course-image">
                <img
                  src={`/img/${decodeURIComponent(selectedCourse?.imgUrl)}`}
                  alt={selectedCourse?.name}
                />
                <div className="play-button">▶</div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePage;
// id_8
// Función para obtener la lista de cursos recomendados desde el backend (GET /courses).
// Esta llamada debe ejecutarse al cargar el componente CourseCard y actualizar el estado de cursos.
// Función para agregar un curso al perfil del usuario (POST).
// Se llamará cuando el usuario haga clic en el botón "Add".
