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
  onEdit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newCompleted, setNewCompleted] = useState(completed);


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
          <Card.Text className="text-center">
            <div className="d-inline-flex align-items-center justify-content-center">
              {editing ? (
                <>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCompleted}
                    onChange={(e) => setNewCompleted(e.target.value)}
                    style={{
                      width: "60px",
                      fontSize: "0.8rem",
                      padding: "2px 4px",
                      textAlign: "center",
                    }}
                  />
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      onEdit(newCompleted); 
                      setEditing(false);
                    }}
                    style={{
                      padding: "2px 5px",
                      fontSize: "0.65rem",
                      marginLeft: "6px",
                      lineHeight: "1",
                    }}
                  >
                    ✅
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setNewCompleted(completed); 
                    }}
                    style={{
                      padding: "2px 5px",
                      fontSize: "0.65rem",
                      marginLeft: "4px",
                      lineHeight: "1",
                    }}
                  >
                    ❌
                  </Button>
                </>
              ) : (
                <>
                  <span>Completed: {completed}%</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setEditing(true)}
                    style={{
                      padding: "2px 5px",
                      fontSize: "0.6rem",
                      marginLeft: "6px",
                      lineHeight: "1",
                      height: "22px",
                    }}
                    title="Edit progress"
                  >
                    ✏️
                  </Button>
                </>
              )}
            </div>
          </Card.Text>

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

      {/* Modal del certificado */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="true"
        keyboard={true}
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
