import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import "../styles/AllCourses.css";
import SearchIcon from "@mui/icons-material/Search";


export const AllCourses = () => {
  const API_BACK = process.env.REACT_APP_API_URL; 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado de búsqueda

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${API_BACK}/courses/`,
          {
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch courses");
        }

        setCourses(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar cursos por nombre según lo que escriba el usuario
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Container className="all-couses">
        <Row className="align-items-center mb-4">
          <Col>
            <h2>Available Courses</h2>
          </Col>
          <Col md="4">
            <div className="search-bar-container">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}
        {filteredCourses.length === 0 && !loading && !error ? (
          <Alert className="text-center custom-alert">No results found.</Alert>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredCourses.map((course) => (
              <Col key={course.id}>
                <CourseCard
                  image={course.imgUrl || "placeholder.jpg"}
                  title={course.name}
                  description={course.description}
                  completed={course.completed || 0}
                  actionText="Add"
                  showCertificate={false}
                  onActionClick={() => alert(`Added course: ${course.name}`)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};
