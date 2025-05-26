import React, { useEffect, useState } from 'react';
import Header from './Header';
import StaffCard from './StaffCard';
import ProjectCardLink from './ProjectCardLink';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import '../styles/TfsView.css';

export const TfsView = () => {
  const [staffList, setStaffList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projectList.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-view">
      <Header title="TFS View" subtitle="Welcome to the TFS View" />

      <Container className="mt-1">
       <Row className="align-items-center mb-1">
  <Col xs={12} md={8} className="d-flex align-items-center">
    <h4
      className={`section-header clickable me-4 ${activeSection === 'staff' ? 'active-tab' : ''}`}
      onClick={() => setActiveSection('staff')}
    >
      Staff information
    </h4>
    <h4
      className={`section-header clickable me-4 ${activeSection === 'projects' ? 'active-tab' : ''}`}
      onClick={() => setActiveSection('projects')}
    >
      Projects information
    </h4>
  </Col>

  <Col xs={12} md={4} className="mt-2 mt-md-0">
    <div className="search-bar-container-Tfs position-relative">
      <SearchIcon className="search-icon-Tfs position-absolute" />
      <input
        type="text"
        className="form-control search-input-Tfs ps-4"
        placeholder={`Search ${activeSection}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </Col>
</Row>

        {/* Renderizado */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {activeSection === 'staff' && (
              filteredStaff.length > 0 ? (
                <Row>
                  {filteredStaff.map((staff) => (
                    <Col key={staff.email} md={6} lg={4}>
                      <StaffCard staff={staff} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert  className="text-center custom-alert">No staff found.</Alert>
              )
            )}

            {activeSection === 'projects' && (
              filteredProjects.length > 0 ? (
                <Row>
                  {filteredProjects.map((project) => (
                    <Col key={project.id} md={6} lg={4}>
                      <ProjectCardLink project={project} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="success" className="text-center">No projects found.</Alert>
              )
            )}
          </>
        )}
      </Container>
    </div>
  );
};
