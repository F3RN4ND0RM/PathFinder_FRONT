import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import {
  FaHourglassStart,
  FaHourglassEnd,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import Header from "../components/Header";
import '../styles/ProjectDetails.css';

export const ProjectDetailM = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [roles, setRoles] = useState([{ name: '', description: '' }]);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`https://pathfinder-back-hnoj.onrender.com/projects/${id}`, {
          headers: { 'Content-Type': 'application/json', token },
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else setProject(data.project);
      } catch {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index][field] = value;
    setRoles(updatedRoles);
  };

  const handleAddRole = () => {
    setRoles([...roles, { name: '', description: '' }]);
  };

  const handleRemoveRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  const handleSubmitRoles = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://pathfinder-back-hnoj.onrender.com/projects/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          projectId: parseInt(id),
          roles: roles,
        }),
      });

      const data = await response.json();
      setSubmitMessage(data.msg || data.error || 'Unexpected response');
    } catch (error) {
      setSubmitMessage('Something went wrong');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading project...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Project not found</Alert>
      </Container>
    );
  }

  return (
    <>
      <Header
        title={`${project.name}`}
        subtitle={`Client: ${project.client}`}
        notifications={[]}
        collapsed={false}
        setCollapsed={() => {}}
        name={project.name}
        client={project.client}
      />

      <Container className="mt-5">

        {/* Detalles del proyecto */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <p className="text-muted mb-4">Description: {project.description}</p>

            <Row className="mb-2 align-items-center">
              <Col xs={1}><FaHourglassStart style={{ color: '#6f42c1' }} /></Col>
              <Col><strong>Start Date:</strong> {project.startDate || 'Not defined'}</Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col xs={1}><FaHourglassEnd style={{ color: '#6f42c1' }} /></Col>
              <Col><strong>End Date:</strong> {project.endDate || 'In progress'}</Col>
            </Row>

            <Row className="align-items-center">
              <Col xs={1}><FaCalendarAlt style={{ color: '#6f42c1' }} /></Col>
              <Col>
                <strong>Status:</strong>{' '}
                {project.status ? (
                  <span className="text-success">
                    <FaCheckCircle className="me-1" /> Active
                  </span>
                ) : (
                  <span className="text-muted">
                    <FaTimesCircle className="me-1" /> Inactive
                  </span>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Formulario para agregar roles */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5>Add Roles</h5>
            {roles.map((role, index) => (
              <Row key={index} className="mb-2">
                <Col md={5}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Role Name"
                    value={role.name}
                    onChange={(e) => handleRoleChange(index, 'name', e.target.value)}
                  />
                </Col>
                <Col md={5}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Role Description"
                    value={role.description}
                    onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <button
                    className='remove'
                    onClick={() => handleRemoveRole(index)}
                  >
                    Remove
                  </button>
                </Col>
              </Row>
            ))}

            <button className="outline-purple-add-role btn btn-sm"  onClick={handleAddRole}>
              + Add Role
            </button>

            <button  className="outline-purple-submit-role btn btn-sm" onClick={handleSubmitRoles}>
              Submit Roles
            </button>

            {submitMessage && (
              <Alert className="text-center custom-alert mt-3 ">
                {submitMessage}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
