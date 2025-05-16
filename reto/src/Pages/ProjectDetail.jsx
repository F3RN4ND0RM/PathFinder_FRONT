import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Spinner, Alert, Row, Col, Badge, Card,
  Form, Modal, Button
} from 'react-bootstrap';
import {
  FaHourglassStart, FaHourglassEnd, FaCalendarAlt,
  FaCheckCircle, FaTimesCircle, FaPlus, FaMinus
} from 'react-icons/fa';
import "../styles/ProjectDetails.css";
import '../styles/StaffCard.css';
import StaffCardProject from '../components/StaffCardProject';
import SearchBar from '../components/SearchBar';


const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [candidates, setCandidates] = useState([]);

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

  const handleRemoveClick = (role) => {
    setSelectedRole(role);
    setModalType('remove');
    setShowModal(true);
  };

  const handleAddClick = async (role) => {
    setSelectedRole(role);
    setModalType('add');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://pathfinder-back-hnoj.onrender.com/employees/staff', {
        headers: { 'Content-Type': 'application/json', token },
      });
      const data = await res.json();
      if (Array.isArray(data.staff)) setCandidates(data.staff);
      else console.error("No candidates found");
    } catch (err) {
      console.error("Error fetching candidates", err);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setModalType(null);
    setCandidates([]);
  };

  const handleConfirmRemove = () => {
    console.log(`Removing employee from role: ${selectedRole}`);
    setShowModal(false);
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

  const filteredRoles = (project.Roles || []).filter(({ name }) =>
    name.toLowerCase().includes(roleFilter.toLowerCase())
  );



  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-4">
        <Col md={10}>
          <h2 className="mb-1">{project.name}</h2>
          <p className="text-muted mb-0">Client: <strong>{project.client || 'Unassigned'}</strong></p>
        </Col>
      </Row>

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
                <span className="text-success"><FaCheckCircle className="me-1" />Active</span>
              ) : (
                <span className="text-muted"><FaTimesCircle className="me-1" />Inactive</span>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="project-details-page" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <h4>Assigned Roles</h4>
        <SearchBar
          placeholder="Search roles..."
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        />

      </div>

      <Row className="mt-3">
      {filteredRoles.length > 0 ? filteredRoles.map(({ role, description, employee }, idx) => (
  <Col key={idx} md={4} className="mb-3">
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <h5>{role}</h5>
        <p className="text-muted">{description}</p>
        <p><strong>Employee:</strong>{' '}
          {employee ? employee : <span className="text-muted">Not assigned</span>}
        </p>

        {employee ? (
          <Button
            variant="outline-danger"
            className="d-flex align-items-center gap-2"
            onClick={() => handleRemoveClick(role)}
          >
            <FaMinus /> Remove from role
          </Button>
        ) : (
          <Button
            variant="outline-success"
            className="d-flex align-items-center gap-2"
            onClick={() => handleAddClick(role)}
          >
            <FaPlus /> Add to role
          </Button>
        )}
      </Card.Body>
    </Card>
  </Col>
)) : (
  <Col>
    <p className="text-muted">No roles match your search.</p>
  </Col>
)}

      </Row>

      <Modal
  show={showModal}
  onHide={handleCloseModal}
  centered
  dialogClassName="custom-modal-width"
>
  <Modal.Header closeButton>
    <Modal.Title>
      {modalType === 'remove' ? `Remove from ${selectedRole}` : `Add to ${selectedRole}`}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body className="custom-modal-body">
    {modalType === 'remove' ? (
      <p>
        Are you sure you want to remove the employee from the <strong>{selectedRole}</strong> role?
      </p>
    ) : (
      <>
        <p>Select a candidate for <strong>{selectedRole}</strong>:</p>
        {candidates.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
              maxHeight: '375px'
            }}
          >
            {candidates.map((emp) => (
              <StaffCardProject key={emp.id || emp._id} staff={emp} />
            ))}
          </div>
        ) : (
          <p>No available candidates</p>
        )}
      </>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancel
    </Button>
    {modalType === 'remove' && (
      <Button variant="danger" onClick={handleConfirmRemove}>
        Remove
      </Button>
    )}
  </Modal.Footer>
</Modal>

    </Container>
  );
};

export default ProjectDetail;






