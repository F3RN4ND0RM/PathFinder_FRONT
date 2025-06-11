import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import "../styles/Courses.css";
import { FaEdit } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const API_BACK = process.env.REACT_APP_API_URL;
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          `${API_BACK}/employees/courses`,
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

  const handleEdit = async (courseId, newStatus) => {
    const num = Number(newStatus);
    if (isNaN(num) || num < 0 || num > 100) {
      alert("Please enter a valid percentage (0–100).");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BACK}/employees/courseStatus/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          courseId,
          status: num,
        }),
      });

      if (res.ok) {
        const updated = courses.map((c) =>
          c.id === courseId
            ? { ...c, Courseinfo: { ...c.Courseinfo, status: num } }
            : c
        );
        setCourses(updated);
        localStorage.setItem(
          "completedCourses",
          JSON.stringify(updated.filter((c) => c.Courseinfo.status === 100).map((c) => c.name))
        );
      } else {
        alert("Failed to update course.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error.");
    }
  };
  
  return (
    <div className="courses-page">
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
                    actionText="Keep Learning"
                    showCertificate={false}
                    onDelete={() => handleDelete(course.name)}
                    onEdit={(newStatus) => handleEdit(course.id, newStatus)}
                    isEditable={true}
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
                    onEdit={(newValue) => handleEdit(course.id, newValue)}
                    isEditable={false}
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
