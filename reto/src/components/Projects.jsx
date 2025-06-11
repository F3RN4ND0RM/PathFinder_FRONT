import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, ProgressBar, Badge, ListGroup } from "react-bootstrap";
import { Laptop } from "react-bootstrap-icons";
import "../styles/Projects.css";

const Projects = ({ projects }) => {
  const [progressValues, setProgressValues] = useState(projects.map(() => 0));

  useEffect(() => {
    projects.forEach((project, index) => {
      const target = project.percentage;
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setProgressValues((prev) => {
          const updated = [...prev];
          updated[index] = current;
          return updated;
        });
        if (current >= target) clearInterval(interval);
      }, 10);
    });
  }, [projects]);

  return (
    <Card className="projects-card ">
      <Card.Body>
          <h5 className="mb-1 section-header">Projects</h5>
        {projects.length === 0 ? (
          <div className="text-center py-4 text-muted">No active projects</div>
        ) : (
          <ListGroup variant="flush">
            {projects.map((project, i) => (
              <ListGroup.Item
                key={i}
                className="border-bottom py-3 px-3 project-item"
              >
                <div className="d-flex justify-content-between mb-2">
                  <h6 className="mb-0 fw-semibold text-dark">{project.name}</h6>
                  <Badge
                    pill
                    bg={project.status ? "primary" : "secondary"}
                    className="me-2"
                  >
                    {project.status ? "Active" : "Paused"}
                  </Badge>
                  <small className="text-muted">
                    <Laptop className="me-1" size={12} />
                    {project.platform}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <ProgressBar
                    now={progressValues[i]}
                    className="flex-grow-1 me-3 animated-progress"
                    variant="info"
                    style={{ height: "8px", borderRadius: "10px" }}
                  />
                  <small className="fw-bold text-primary">
                    {project.percentage}%
                  </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

Projects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
      status: PropTypes.bool,
    })
  ).isRequired,
};

export default Projects;
