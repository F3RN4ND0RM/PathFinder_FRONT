import React, { useContext, useEffect, useState } from "react";
import ProjectTimeline from "../components/ProjectTimeline";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/UserContext";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [apiData, setApiData] = useState(null);
  const [userAbilities, setUserAbilities] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          "https://pathfinder-back-hnoj.onrender.com/employees/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );
        const data = await response.json();
        console.log("📦 Datos del backend:", data);

        if (!data.error) {
          setApiData(data);
          setUserAbilities(data.abilitiesOfEmployee || []);
          localStorage.setItem("userName", data.name);
        }
      } catch (error) {
        console.error("❌ Error al conectar con /employees:", error);
      }
    };

    const fetchInactiveProjects = async () => {
      try {
        const apiUrl = new URL(
          "https://pathfinder-back-hnoj.onrender.com/employees/projects"
        );
        apiUrl.searchParams.append("status", "false");

        const response = await fetch(apiUrl.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        if (!response.ok) throw new Error("Error en la solicitud");

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        const formattedProjects = data.rolesOfEmployee.map((role) => ({
          id: role.id,
          name: role.Project.name,
          platform: role.name,
          percentage: role.Assigned?.status ? 50 : 0,
          status: role.Project.status,
        }));

        const inactiveProjects = formattedProjects.filter(
          (project) => !project.status
        );

        const projectDescriptions = inactiveProjects.map(
          (project) => `${project.name} (${project.platform})`
        );

        localStorage.setItem(
          "inactiveProjects",
          JSON.stringify(projectDescriptions)
        );
      } catch (error) {
        console.error("Error obteniendo proyectos inactivos:", error);
      }
    };

    const fetchCompletedCourses = async () => {
      try {
        const response = await fetch(
          "https://pathfinder-back-hnoj.onrender.com/employees/courses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        const data = await response.json();

        if (!data.error) {
          const fetchedCourses = data.coursesOfEmployee || [];
          const completedCourses = fetchedCourses.filter(
            (course) => Number(course.Courseinfo.status) === 100
          );
          const courseNames = completedCourses.map((course) => course.name);
          localStorage.setItem("completedCourses", JSON.stringify(courseNames));
          setCompletedCourses(courseNames);
        }
      } catch (error) {
        console.error("❌ Error fetching completed courses:", error);
      }
    };

    fetchProfileData();
    fetchInactiveProjects();
    fetchCompletedCourses();
  }, [token]);

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  const name = localStorage.getItem("userName") || "Usuario";
  const role = apiData?.rolename || userData.role || "Tu rol";
  const email = apiData?.email || userData.email || "Tu correo";
  const assigned = apiData?.percentage || userData.assigned || "--";
  const storedCourses = completedCourses.length
    ? completedCourses
    : JSON.parse(localStorage.getItem("completedCourses")) || [];
  const inactiveProjects =
    JSON.parse(localStorage.getItem("inactiveProjects")) || [];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-user-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">
            <span className="role-badge">{role}</span>
          </p>
          <div className="profile-info">
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <span>{email}</span>
            </div>
            <div className="info-item assigned">
              <i className="fas fa-tasks"></i>
              <strong>Assigned: {assigned}%</strong>
            </div>
          </div>
        </div>

        <button className="edit-button" onClick={handleEdit}>
          <i className="fas fa-edit"></i> Edit Profile
        </button>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <div className="skills-box profile-info-box">
            <div className="box-header">
              <i className="fas fa-code"></i>
              <h5>Skills</h5>
            </div>
            <div className="box-content skills-list">
              {userAbilities.length > 0 ? (
                <div className="skills-list inline-skills">
                  {userAbilities.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      <i className="fas fa-check"></i> {skill.name}
                      {index < userAbilities.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              ) : (
                <span>No skills added yet</span>
              )}
            </div>
          </div>

          <div className="courses-box profile-info-box">
            <div className="box-header">
              <i className="fas fa-graduation-cap"></i>
              <h5>Completed Courses</h5>
            </div>
            <div className="box-content">
              {storedCourses.length > 0 ? (
                storedCourses.map((course, index) => (
                  <span key={index} className="course-item">
                    <i className="fas fa-check-circle"></i> {course}
                  </span>
                ))
              ) : (
                <span>No courses completed yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="projects-box profile-info-box full-width">
          <div className="box-header">
            <i className="fas fa-project-diagram"></i>
            <h5>Completed Projects</h5>
          </div>
          <div className="box-content">
            {inactiveProjects.length > 0 ? (
              inactiveProjects.map((project, index) => (
                <span key={index} className="course-item">
                  <i className="fas fa-times-circle"></i> {project}
                </span>
              ))
            ) : (
              <span>No completed projects yet</span>
            )}
          </div>
        </div>

        {/* ✅ Nueva sección con línea de tiempo */}
        <div className="project-timeline-box">
          <ProjectTimeline />
        </div>
      </div>{" "}
    </div>
  );
}

export default Profile;
