import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import '../styles/CreateProject.css';

const CreateProjectPage = () => {
  const API_BACK = process.env.REACT_APP_API_URL; 
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('#A100FF');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expiration: '',
  });

  const handleCancel = () => {
    navigate("/assignation");
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Si es el campo de fecha, formatear correctamente
  if (name === 'startDate') {
    const date = new Date(value);
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    
    setFormData({
      ...formData,
      [name]: formattedDate
    });
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

  const showNotification = (message, color = '#A100FF') => {
    setAlertMessage(message);
    setAlertColor(color); 
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, description, expiration } = formData;

  if (!name || !description || !expiration) {
    showNotification("Please fill in all fields.", "danger");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      showNotification("No auth token found. Please log in again.", "danger");
      return;
    }

    const response = await fetch(
      `${API_BACK}/projects/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || "Unknown error creating project.";
      showNotification(`Error: ${message}`, "danger");
      return;
    }

    showNotification("Project created successfully!", '#A100FF');

    // Espera 2 segundos para mostrar la alerta antes de redirigir
    setTimeout(() => {
      navigate("/assignation");
    }, 2000);

  } catch (err) {
    console.error("Error submitting form:", err);
    showNotification("Failed to create project due to a network or server issue.", "danger");
  }
};


  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Alert Notification */}
      <div className="custom-alert-container">
        <Alert 
          show={showAlert} 
          variant={alertColor} 
          onClose={() => setShowAlert(false)} 
          dismissible
        >
          {alertMessage}
        </Alert>
      </div>

      <Card className="project-form-card">
        <Card.Body>
          <h2 className="form-title">Create New Project</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-4">
              <Form.Label className="form-label">Project Name</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                className="form-textarea"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-4">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                className="form-textarea"
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => {
                  handleInputChange(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                required
              />
            </Form.Group>

            <Form.Group controlId="formExpiration" className="mb-4">
              <Form.Label className="form-label">Start Date</Form.Label>
              <Form.Control
                type="date"
                name="expiration"
                className="form-date-input"
                value={formData.expiration}
                onChange={handleInputChange}
                required
                  min="2000-01-01" // Fecha mínima opcional
                max="2100-12-31" // Fecha máxima opcional
              />
              <Form.Text className="text-muted">
                Formato: YYYY/MM/DD (ej. 2000/02/28)
              </Form.Text>
                          
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="button" className="new-project-btn" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="new-project-btn">
                Create Project
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateProjectPage;