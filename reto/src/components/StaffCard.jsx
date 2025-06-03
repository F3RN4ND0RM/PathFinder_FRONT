import { useState } from 'react';
import { Badge, Card, ListGroup } from 'react-bootstrap';
import '../styles/StaffCard.css';

const StaffCard = ({ staff }) => {
  const [expanded, setExpanded] = useState(false);
  const { 
    name, 
    email, 
    capability, 
    rolename, 
    abilitiesOfEmployee, 
    rolesOfEmployee, 
    certificationsOfEmployee 
  } = staff;

  return (
    <Card 
      className={`staff-card-wrapper ${expanded ? 'expanded' : ''} clickable`}
      onClick={() => setExpanded(!expanded)}
    >
      <Card.Body>
        <div className="staff-header">
          <h3 className="staff-name">{name}</h3>
          <Badge bg="purple" className="staff-role">{rolename}</Badge>
        </div>

        <div className="staff-details">
          <div className="staff-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{email}</span>
          </div>
          <div className="staff-detail-item">
            <span className="detail-label">Capability:</span>
            <span className="detail-value">{capability}</span>
          </div>
        </div>

        <div className="click-indicator">
          {expanded ? '▲ Ver menos' : '▼ Ver más'}
        </div>
      </Card.Body>

      {expanded && (
        <Card.Body className="card-slide-info">
          {abilitiesOfEmployee?.length > 0 && (
            <div className="info-section">
              <h4>Habilidades</h4>
              <ListGroup variant="flush">
                {abilitiesOfEmployee.map((ability) => (
                  <ListGroup.Item key={ability.id}>{ability.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {rolesOfEmployee?.length > 0 && (
            <div className="info-section">
              <h4>Roles</h4>
              <ListGroup variant="flush">
                {rolesOfEmployee.map((role) => (
                  <ListGroup.Item key={role.id}>
                    <div><strong>{role.name}</strong></div>
                    <small>{role.description}</small><br />
                    <Badge bg={role.Assigned?.status ? 'success' : 'secondary'}>
                      {role.Assigned?.status ? 'Asignado' : 'Finalizado'}
                    </Badge>
                    {role.Project?.name && <span> - Proyecto: {role.Project.name}</span>}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {certificationsOfEmployee?.length > 0 && (
            <div className="info-section">
              <h4>Certificaciones</h4>
              <ListGroup variant="flush">
                {certificationsOfEmployee.map((cert) => (
                  <ListGroup.Item key={cert.id}>
                    <div><strong>{cert.name}</strong></div>
                    <small>{cert.description}</small><br />
                    <span className="custom-expiration-badge">
                      Expira: {cert.Certinfo?.expiration}
                    </span>
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

export default StaffCard;
