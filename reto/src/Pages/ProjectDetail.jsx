import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Modal,
  Button
} from 'react-bootstrap';
import {
  FaHourglassStart,
  FaHourglassEnd,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

import '../styles/ProjectDetails.css';
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
  const [candidateFilter, setCandidateFilter] = useState('');
  const [confirmingEmployee, setConfirmingEmployee] = useState(null);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);


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

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://pathfinder-back-hnoj.onrender.com/employees/staff', {
        headers: { 'Content-Type': 'application/json', token },
      });
      const data = await res.json();
      if (Array.isArray(data.staff)) setCandidates(data.staff);
      else console.error('No candidates found');
    } catch (err) {
      console.error('Error fetching candidates', err);
    }
  };

  const fetchAISuggestions = async (roleId, roleName) => {
    try {
      setAISuggestions([]);
      const token = localStorage.getItem('authToken');

      const aiRes = await fetch(`https://pathfinder-back-hnoj.onrender.com/ai/staff?roleId=${roleId}`, {
        headers: { 'Content-Type': 'application/json', token },
      });
      const aiData = await aiRes.json();

      const normalize = (str) => str.trim().toLowerCase();

      // Encuentra la clave correcta del rol
      const roleKey = Object.keys(aiData).find(
        key => normalize(key) === normalize(roleName)
      );

      const aiSuggestionsRaw = roleKey ? aiData[roleKey] : [];
      const suggestedIds = aiSuggestionsRaw.map(emp => emp.id);

      // Carga todos los empleados y filtra
      const allRes = await fetch(`https://pathfinder-back-hnoj.onrender.com/employees/staff`, {
        headers: { 'Content-Type': 'application/json', token },
      });
      const allData = await allRes.json();

      const detailedSuggestions = allData.staff.filter(emp =>
        suggestedIds.includes(emp.id)
      );

      setAISuggestions(detailedSuggestions);
    } catch (err) {
      console.error('Error fetching AI suggestions', err);
      setAISuggestions([]);
    }
  };


  const handleAssignClick = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !selectedRole || !confirmingEmployee) return;

    try {
      const res = await fetch('https://pathfinder-back-hnoj.onrender.com/projects/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({
          roleId: selectedRole.id || selectedRole._id,
          employeeId: confirmingEmployee.id || confirmingEmployee._id,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else if (data.msg) {
        alert(data.msg);

        const roleId = selectedRole.id || selectedRole._id;

        setProject(prev => {
          const updatedRoles = (prev.Roles || []).map(role => {
            const currentRoleId = role.id || role._id;
            if (currentRoleId === roleId) {
              return {
                ...role,
                rolesByEmployee: [confirmingEmployee]
              };
            }
            return role;
          });
          return { ...prev, Roles: updatedRoles };
        });

        handleCloseModal();
      } else {
        alert('Unexpected response');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to assign employee');
    }
  };


  const handleRemoveClick = (role) => {
    setSelectedRole(role);
    setModalType('remove');
    setShowModal(true);
  };

  const handleAddClick = async (role) => {
    setSelectedRole(role);
    setModalType('add');
    setCandidateFilter('');
    await fetchCandidates();
    setShowModal(true);
  };

  const handleAISuggestionsClick = async (role) => {
    setSelectedRole(role);
    setModalType('aiSuggestions');
    setAISuggestions([]);
    setAiLoading(true);      
    setShowModal(true);     
    await fetchAISuggestions(role.id || role._id, role.name);
    setAiLoading(false);  
  };


  const handleCandidateClick = (employee) => {
    setConfirmingEmployee(employee);
    setModalType('confirmAssign');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setModalType(null);
    setCandidates([]);
    setCandidateFilter('');
    setConfirmingEmployee(null);
    setAISuggestions([]);
  };

  const handleConfirmRemove = () => {
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

  const filteredCandidates = candidates.filter((c) =>
    c.name?.toLowerCase().includes(candidateFilter.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-4">
        <Col md={10}>
          <h2 className="mb-1">{project.name}</h2>
          <p className="text-muted mb-0">
            Client: <strong>{project.client || 'Unassigned'}</strong>
          </p>
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

      <div className="project-details-page d-flex align-items-center gap-4">
        <h4>Assigned Roles</h4>
        <SearchBar
          placeholder="Search roles..."
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
      </div>

      <Row className="mt-3">
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role, idx) => {
            const assignedEmployee = role.rolesByEmployee?.[0];
            return (
              <Col key={idx} md={4} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <h5>{role.name}</h5>
                    <p className="text-muted">{role.description}</p>
                    <p><strong>Employee:</strong>{' '}
                      {assignedEmployee ? assignedEmployee.name : (
                        <span className="text-muted">Not assigned</span>
                      )}
                    </p>

                    {assignedEmployee ? (
                      <Button
                        variant="danger" 
                        className="d-flex align-items-center gap-2"
                        onClick={() => handleRemoveClick(role)}
                      >
                        <FaMinus /> Remove from role
                      </Button>
                    ) : (
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          variant="success" 
                          className="d-flex align-items-center gap-2"
                          onClick={() => handleAddClick(role)}
                        >
                          <FaPlus /> Add to role
                        </Button>
                        <Button
                          variant="accenture"
                          className="d-flex align-items-center gap-2"
                          onClick={() => handleAISuggestionsClick(role)}
                        >
                          <FaPlus /> AI Suggestions
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col>
            <p className="text-muted">No roles match your search.</p>
          </Col>
        )}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'remove'
              ? `Remove from ${selectedRole?.name}`
              : modalType === 'confirmAssign'
              ? `Confirm assignment`
              : `Add to ${selectedRole?.name}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="custom-modal-body">
          {modalType === 'remove' ? (
            <p>
              Are you sure you want to remove the employee from the{' '}
              <strong>{selectedRole?.name}</strong> role?
            </p>
          ) : modalType === 'confirmAssign' ? (
            <p>
              Are you sure you want to assign{' '}
              <strong>{confirmingEmployee?.name}</strong> to{' '}
              <strong>{selectedRole?.name}</strong>?
            </p>
          ) : (
            <>
              <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                <p className="mb-0">
                  {modalType === 'aiSuggestions'
                    ? 'AI Suggested candidates for '
                    : `Select a candidate for `}
                  <strong>{selectedRole?.name}</strong>:
                </p>
                {modalType === 'add' && (
                  <SearchBar
                    placeholder="Search candidates..."
                    value={candidateFilter}
                    onChange={(e) => setCandidateFilter(e.target.value)}
                  />
                )}
              </div>
              {modalType === 'aiSuggestions' && aiLoading ? (
  <div className="text-center my-4">
    <Spinner animation="border" variant="primary" />
    <p className="mt-2">Loading AI suggestions...</p>
  </div>
) : (
  <>
    {(modalType === 'add' ? filteredCandidates : aiSuggestions).length > 0 ? (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          maxHeight: '375px',
          overflowY: 'auto'
        }}
      >
        {(modalType === 'add' ? filteredCandidates : aiSuggestions).map((emp) => (
          <StaffCardProject
            key={emp.id || emp._id}
            staff={emp}
            onAssign={() => handleCandidateClick(emp)}
            showDetails={false}
          />
        ))}
      </div>
    ) : (
      <p>No available candidates</p>
    )}
  </>
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
          {modalType === 'confirmAssign' && (
            <Button variant="success" onClick={handleAssignClick}>
              Confirm Assign
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectDetail;

