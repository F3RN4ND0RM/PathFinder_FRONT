import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectCard.css'; // Usa los mismos estilos si deseas

const ProjectCardLink = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/assignation/project/${project.id}`);
  };

  return (
    <Card className="project-card-wrapper clickable" onClick={handleClick}>
      <Card.Body>
        <div className="project-header">
          <h3 className="project-name">{project.name}</h3>
          <Badge bg="purple" className="project-role">Project</Badge>
        </div>
        <div className="project-details">
          <div className="project-detail-item">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{project.description}</span>
          </div>
          <div className="project-detail-item">
            <span className="detail-label">Start:</span>
            <span className="detail-value">{project.startDate || 'Not defined'}</span>
          </div>
          <div className="project-detail-item">
            <span className="detail-label">End:</span>
            <span className="detail-value">{project.endDate || 'In progress'}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCardLink;
