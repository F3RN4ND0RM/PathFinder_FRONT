import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import StaffCard from './StaffCard';
import ProjectCard from './ProjectCard';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import '../styles/ManagerView.css';

export const ManagerView = () => {
  const [staffList, setStaffList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('staff'); // <- nuevo

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const [staffRes, projectRes] = await Promise.all([
          fetch('https://pathfinder-back-hnoj.onrender.com/employees/staff', {
            headers: { 'Content-Type': 'application/json', token },
          }),
          fetch('https://pathfinder-back-hnoj.onrender.com/projects/', {
            headers: { 'Content-Type': 'application/json', token },
          }),
        ]);

        const staffData = await staffRes.json();
        const projectData = await projectRes.json();

        if (staffData.error || projectData.error) {
          setError(staffData.error || projectData.error);
        } else {
          setStaffList(staffData.staff || []);
          setProjectList(projectData.projects || []);
        }
      } catch (err) {
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewProjectClick = () => {
    navigate('/createproject');
  };

  return (
    <div className="manager-view">
      <Header title="Manager View" subtitle="Welcome to the Manager View" />

      <Container className="mt-3">
        {/* Navegación de secciones */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex">
            <h4
              className={`section-header clickable me-4 ${activeSection === 'staff' ? 'active-tab' : ''}`}
              onClick={() => setActiveSection('staff')}
            >
              Staff information
            </h4>
            <h4
              className={`section-header clickable ${activeSection === 'projects' ? 'active-tab' : ''}`}
              onClick={() => setActiveSection('projects')}
            >
              Projects information
            </h4>
          </div>
          <Button className="new-project-btn" variant="outline" onClick={handleNewProjectClick}>
            New Project
          </Button>
        </div>

        {/* Renderizado condicional */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {activeSection === 'staff' && (
              staffList.length > 0 ? (
                <Row>
                  {staffList.map((staff) => (
                    <Col key={staff.email} md={6} lg={4}>
                      <StaffCard staff={staff} />
                    </Col>
                  ))}
                </Row>
              ) : <p>No staff found.</p>
            )}

            {activeSection === 'projects' && (
              projectList.length > 0 ? (
                <Row>
                  {projectList.map((project) => (
                    <Col key={project.id} md={6} lg={4}>
                      <ProjectCard project={project} />
                    </Col>
                  ))}
                </Row>
              ) : <p>No Projects.</p>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
