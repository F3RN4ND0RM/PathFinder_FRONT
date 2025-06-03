import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/Coursecard.css";

const CourseCard = ({
  image,
  title,
  description,
  completed,
  actionText,
  showCertificate,
  onActionClick,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    if (showCertificate) {
      setShowModal(true);
    } else {
      onActionClick && onActionClick();
    }
  };

  return (
    <>
      <Card className="course-card-wrapper">
        <div className="card-hover-effect">
          <div className="card-img-slide">
            <Card.Img src={`img/${image}`} alt={title} className="custom-img" />
          </div>
          <div className="card-description-slide">
            <p>{description}</p>
          </div>
        </div>

        <Card.Body className="card-static-info">
          <Card.Title>{title}</Card.Title>
          <Card.Text>Completed: {completed}%</Card.Text>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              style={{
                backgroundColor: "var(--accent-color)",
                borderColor: "var(--accent-color)",
              }}
              onClick={handleButtonClick}
            >
              {actionText}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="true" // permite cerrar al hacer click fuera
        keyboard={true} // permite cerrar con Esc
        contentClassName="custom-modal-content"
      >
        <Modal.Body className="d-flex justify-content-center align-items-center p-0">
          <img
            src="/img/Certification.jpeg"
            alt="Course Certificate"
            className="img-fluid"
            style={{
              maxHeight: "90vh",
              maxWidth: "100%",
              border: "1px solid #ccc",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            className="view"
            variant="primary"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/img/Certification.jpeg";
              link.download = "certificate.jpeg";
              link.click();
            }}
          >
            Download Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CourseCard;
