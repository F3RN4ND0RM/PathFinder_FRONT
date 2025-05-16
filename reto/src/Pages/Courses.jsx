import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          "https://pathfinder-back-hnoj.onrender.com/employees/courses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
          setError(data.error);
        } else {
          const fetchedCourses = data.coursesOfEmployee || [];
          setCourses(fetchedCourses);

          // Guardar cursos completados en localStorage
          const completedCourses = fetchedCourses.filter(
            (course) => Number(course.Courseinfo.status) === 100
          );
          const courseNames = completedCourses.map((course) => course.name);
          localStorage.setItem("completedCourses", JSON.stringify(courseNames));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Something went wrong");
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = (title) => {
    const updated = courses.filter((course) => course.name !== title);
    setCourses(updated);

    const updatedCompleted = updated
      .filter((course) => Number(course.Courseinfo.status) === 100)
      .map((course) => course.name);
    localStorage.setItem("completedCourses", JSON.stringify(updatedCompleted));
  };

  const inProgressCourses = courses.filter(
    (course) => Number(course.Courseinfo.status) < 100
  );
  const completedCourses = courses.filter(
    (course) => Number(course.Courseinfo.status) === 100
  );

  return (
    <div className="courses-page">
      <Header
        title="Your learning journey continues here"
        subtitle="Pick up where you left off and continue growing your skills!"
        notifications={[]}
      />

      <Container>
        {error && <div className="alert alert-danger">{error}</div>}

        {inProgressCourses.length > 0 && (
          <>
            <Row className="align-items-center justify-content-between mt-4 mb-2">
              <Col>
                <h2 className="section-header m-0">Courses in Progress</h2>
              </Col>
              <Col className="text-end">
                <a href="/allcourses" className="explore-link">
                  Explore
                </a>
              </Col>
            </Row>
            <Row className="g-4">
              {inProgressCourses.map((course, idx) => (
                <Col lg={3} md={6} sm={12} key={idx}>
                  <CourseCard
                    image={course.imgUrl || "placeholder.jpg"}
                    title={course.name}
                    description={course.description}
                    completed={course.Courseinfo.status}
                    actionText="Continue"
                    actionLink="#"
                    showCertificate={false}
                    onDelete={() => handleDelete(course.name)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}

        {completedCourses.length > 0 && (
          <>
            <h2 className="section-header mt-4">Completed Courses</h2>
            <Row className="g-4">
              {completedCourses.map((course, idx) => (
                <Col lg={3} md={6} sm={12} key={idx}>
                  <CourseCard
                    image={course.imgUrl || "placeholder.jpg"}
                    title={course.name}
                    description={course.description}
                    completed={course.Courseinfo.status}
                    actionText="View Certificate"
                    actionLink="#"
                    showCertificate={true}
                    onDelete={() => handleDelete(course.name)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Courses;
