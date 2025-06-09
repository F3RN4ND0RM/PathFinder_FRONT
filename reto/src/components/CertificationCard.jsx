import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import "../styles/CertificationCard.css"; // Import your CSS file for custom styles

const CertificationCard = ({ name, description, expiration }) => {
  const expirationDate = new Date(expiration).toLocaleDateString();

  return (
    <Card className="shadow-sm border-0 certification-card">
      <Card.Body>
        <Card.Title className="fw-bold text-dark-purple">{name}</Card.Title>
        <Card.Text className="text-secondary">{description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="badge bg-purple-light text-dark-purple">
            Expira: {expirationDate}
          </span>
          
        </div>
      </Card.Body>
    </Card>
  );
};

CertificationCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  expiration: PropTypes.string.isRequired,
};

export default CertificationCard;
