import { useState } from 'react';
import { Badge, Card, ListGroup } from 'react-bootstrap';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const { name, description, startDate, endDate, Roles } = project;

  return (
    <Card 
      className={`project-card-wrapper ${expanded ? 'expanded' : ''} clickable`}
      onClick={() => setExpanded(!expanded)}
    >
      <Card.Body>
        <div className="project-header">
          <h3 className="project-name">{name}</h3>
          <Badge bg="purple" className="project-role">Proyecto</Badge>
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
};

export default ProjectCard;
