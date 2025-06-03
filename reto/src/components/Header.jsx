import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Notifications from "./Notifications";
import "../styles/Header.css";

const Header = ({
  title,
  subtitle,
  notifications = [],
  collapsed,
  setCollapsed,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isBellAnimated, setIsBellAnimated] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const notificationCount = notifications.length;

  useEffect(() => {
    if (!subtitle) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(subtitle.slice(0, index + 1));
      index++;
      if (index >= subtitle.length) {
        clearInterval(interval);
        setDoneTyping(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [subtitle]);

  const handleBellClick = () => {
    setIsBellAnimated(true);
    setShowNotifications(true);
    setTimeout(() => setIsBellAnimated(false), 500);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-text">
          <div className="header-flex-row">
            {/* Title + Expand button in a row */}
            <div className="header-text-area header-title-row">
              {collapsed && (
                <button
                  className="floating-expand-btn-header"
                  onClick={() => setCollapsed(false)}
                >
                  &gt;
                </button>
              )}

              <div>
                <h1 className="header-title">{title}</h1>
                {subtitle && (
                  <p className="header-subtitle">
                    {displayedText}
                    {!doneTyping && <span className="blinking-cursor">|</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Notification bell */}
            <div className="notification-wrapper">
              <button
                className={`notification-button ${
                  isBellAnimated ? "ringing" : ""
                }`}
                onClick={handleBellClick}
                aria-label="Notifications"
              >
                <svg className="bell-icon" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {notificationCount > 0 && (
                  <span className="notification-counter">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal
        show={showNotifications}
        onHide={handleCloseNotifications}
        centered
        dialogClassName="notification-modal"
        backdropClassName="notification-backdrop"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <i className="bi bi-bell-fill me-2"></i>
            Notifications
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Notifications notifications={notifications} />
        </Modal.Body>
      </Modal>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired,
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};

Header.defaultProps = {
  subtitle: "",
};

export default React.memo(Header);
