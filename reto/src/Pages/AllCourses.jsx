import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import CourseCard from "../components/CourseCard";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

export const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("https://pathfinder-back-hnoj.onrender.com/courses/", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

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

  const showNotification = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAddCourse = async (courseId) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch("https://pathfinder-back-hnoj.onrender.com/employees/courses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        courseId: courseId,  // ✅ minúscula
        favstatus: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showNotification(data.error || "Something went wrong", "danger");
      return;
    }

    showNotification(data.msg || "Course Added");
  } catch (err) {
    showNotification("Something went wrong", "danger");
  }
};


  return (
    <div>
      <Header title="Our Courses" subtitle="Explore our wide range of courses" />

      {/* Alert Notification */}
      <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1000, minWidth: "200px", maxWidth: "400px" }}>
        <Alert show={showAlert} variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      </div>

      <Container className="mt-4">
        <h2 className="section-header m-3">Available Courses</h2>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map((course) => (
            <Col key={course.id}>
              <CourseCard
                image={course.imgUrl || "placeholder.jpg"}
                title={course.name}
                description={course.description}
                completed={course.completed || 0}
                actionText="Add"
                showCertificate={false}
                onActionClick={() => handleAddCourse(course.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
