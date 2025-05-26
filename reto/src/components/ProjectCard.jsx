import { useState } from 'react';
import { Badge, Card, ListGroup, Button } from 'react-bootstrap';
import '../styles/ProjectCard.css';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { id, name, description, startDate, endDate, Roles } = project;

  const handleCreateRolesClick = () => {
    navigate(`/assignation/project/manager/${id}`);
  };
return (
  <Card 
    className={`project-card-wrapper ${expanded ? 'expanded' : ''} clickable`}
    onClick={() => setExpanded(!expanded)}
    style={{ position: 'relative' }} // Habilita posicionamiento absoluto interno
  >
    {/* Botón Create Roles fijo en la esquina */}
    <div className="create-roles-btn-div">
      <Button 
        className='create-roles-btn'
        size="sm" 
        onClick={(e) => {
          e.stopPropagation(); // Evita que expanda la tarjeta
          handleCreateRolesClick();
        }}
      >
        Create Roles
      </Button>
    </div>

    <Card.Body>
      <div className="project-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <h3 className="project-name mb-0">{name}</h3>
          <Badge bg="purple" className="project-role">Proyecto</Badge>
        </div>
      </div>

      <div className="project-details">
        <div className="project-detail-item">
          <span className="detail-label">Descripción:</span>
          <span className="detail-value">{description}</span>
        </div>
        <div className="project-detail-item">
          <span className="detail-label">Inicio:</span>
          <span className="detail-value">{startDate || 'No definido'}</span>
        </div>
        <div className="project-detail-item">
          <span className="detail-label">Fin:</span>
          <span className="detail-value">{endDate || 'En curso'}</span>
        </div>
      </div>

      <div className="click-indicator">
        {expanded ? '▲ Ver menos' : '▼ Ver más'}
      </div>
    </Card.Body>

    {expanded && (
      <Card.Body className="project-slide-info">
        {Roles?.length > 0 && (
          <div className="info-section">
            <h4>Roles</h4>
            <ListGroup variant="flush">
              {Roles.map((role) => (
                <ListGroup.Item key={role.id}>
                  <div><strong>{role.name}</strong></div>
                  <small>{role.description}</small>

                  {role.rolesByEmployee?.length > 0 && (
                    <div className="info-section">
                      <h5>Asignados</h5>
                      <ListGroup variant="flush">
                        {role.rolesByEmployee.map((employee) => (
                          <ListGroup.Item key={employee.id}>
                            <div><strong>{employee.name}</strong></div>
                            <small>{employee.rolename}</small><br />
                            <Badge bg="success">Asignado</Badge>
                            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                              Desde: {new Date(employee.Assigned.createdAt).toLocaleDateString()}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    )}
  </Card>
);
}
export default ProjectCard;
