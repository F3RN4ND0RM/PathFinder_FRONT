import { useState } from 'react';
import { Badge, Card, ListGroup } from 'react-bootstrap';
import '../styles/StaffCard.css';

const StaffCardProject = ({ staff, onAssign }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    name,
    email,
    capability,
    rolename,
    abilitiesOfEmployee,
    rolesOfEmployee,
    certificationsOfEmployee,
  } = staff;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`staff-card-wrapper ${expanded ? 'expanded' : ''} clickable`}
      onClick={toggleExpanded}
    >
      <Card.Body>
        {/* Cabecera con nombre y botón */}
        <div className="staff-header d-flex justify-content-between align-items-center">
          <h3 className="staff-name mb-0">{name}</h3>
          <button
            className="assign-button btn btn-sm btn-success"
            onClick={onAssign}
          >
            Assign to role
          </button>
        </div>

        {/* Detalles básicos */}
        <div className="staff-details">
          <div className="staff-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{email}</span>
          </div>
          <div className="staff-detail-item">
            <span className="detail-label">Capability:</span>
            <span className="detail-value">{capability}</span>
          </div>
          <div className="mt-3">
            <Badge bg="purple" className="staff-role">{rolename}</Badge>
          </div>
        </div>

        {/* Indicador de expansión */}
        <div className="click-indicator">
          {expanded ? '▲ Ver menos' : '▼ Ver más'}
        </div>
      </Card.Body>

      {/* Contenido expandido */}
      {expanded && (
        <Card.Body className="card-slide-info">

          {/* Habilidades */}
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

          {/* Roles */}
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
                    {role.Project?.name && (
                      <span> - Proyecto: {role.Project.name}</span>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {/* Certificaciones */}
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

export default StaffCardProject;
  
