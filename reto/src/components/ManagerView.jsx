import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffCard from "./StaffCard";
import ProjectCard from "./ProjectCard";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import "../styles/ManagerView.css";
import SearchIcon from "@mui/icons-material/Search"



export const ManagerView = () => {
  const API_BACK = process.env.REACT_APP_API_URL;
  const [staffList, setStaffList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("staff"); 
  const [searchTerm, setSearchTerm] = useState(""); 
  console.log(projectList);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const [staffRes, projectRes] = await Promise.all([
          fetch(`${API_BACK}/employees/staff`, {
            headers: { "Content-Type": "application/json", token },
          }),
          fetch(`${API_BACK}/projects/`, {
            headers: { "Content-Type": "application/json", token },
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
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projectList.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewProjectClick = () => {
    navigate("/createproject");
  };

  return (
    <div className="manager-view">
      <Container className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <div className="d-flex align-items-center">
            <h4
              className={`section-header clickable me-4 ${
                activeSection === "staff" ? "active-tab" : ""
              }`}
              onClick={() => setActiveSection("staff")}
            >
              Staff information
            </h4>
            <h4
              className={`section-header clickable ${
                activeSection === "projects" ? "active-tab" : ""
              }`}
              onClick={() => setActiveSection("projects")}
            >
              Projects information
            </h4>
          </div>
          <Col xs={12} md={4} className="mt-2 mt-md-0">
            <div className="search-bar-container">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder={`Search ${activeSection}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Button
            className="new-project-btn"
            variant="outline"
            onClick={handleNewProjectClick}
          >
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {activeSection === "staff" &&
              (staffList.length > 0 ? (
                <Row>
                  {filteredStaff.map((staff) => (
                    <Col key={staff.email} md={6} lg={4}>
                      <StaffCard staff={staff} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No staff found.</p>
              ))}

            {activeSection === "projects" &&
              (projectList.length > 0 ? (
                <Row>
                  {filteredProjects.map((project) => (
                    <Col key={project.id} md={6} lg={4}>
                      <ProjectCard project={project} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No Projects.</p>
              ))}
          </>
        )}
      </Container>
    </div>
  );
};
