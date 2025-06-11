import React, { useContext, useEffect, useState } from "react";
import SidebarExpandButton from "../components/SidebarExpandButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../helpers/UserContext";
import Select from "react-select";
import "../styles/EditProfile.css";

function EditProfile({ collapsed, setCollapsed }) {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const API_BACK = process.env.REACT_APP_API_URL; 
  const [token] = useState(localStorage.getItem("authToken"));
  const [employeeId, setEmployeeId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    assigned: "",
    skills: "",
    courses: "",
    projects: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [abilities, setAbilities] = useState([]);
  const [selectedAbilities, setSelectedAbilities] = useState([]);
  const [originalAbilities, setOriginalAbilities] = useState([]);
  const [certOptions, setCertOptions] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [expirationDates, setExpirationDates] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BACK}/employees/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        const data = await response.json();
        setEmployeeId(data.id);

        if (!data.error) {
          const loadedData = {
            name: data.name || "",
            role: data.rolename || "",
            email: data.email || "",
            assigned: data.percentage || "",
            skills: "",
            courses: "",
            projects: "",
          };
          setForm(loadedData);
          setOriginalData(loadedData);
          setSelectedAbilities(data.AbilitiesA?.map((a) => a.id) || []);
          setOriginalAbilities(data.AbilitiesA?.map((a) => a.id) || []);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    const fetchAbilities = async () => {
      try {
        const res = await fetch(
          `${API_BACK}/abilities`
        );
        const data = await res.json();

        // Filter out abilities the user already has
        const filteredAbilities = data.filter(
          (ability) => !selectedAbilities.includes(ability.id)
        );

        setAbilities(filteredAbilities);
      } catch (err) {
        console.error("Error loading abilities:", err);
      }
    };

    fetchData();
    fetchAbilities();

    const fetchCertifications = async () => {
      try {
        const response = await fetch(`${API_BACK}/certifications`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token, 
          },
        });
        const data = await response.json();
        setCertOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading certifications:", err);
      }
    };

    fetchCertifications();

  }, [token]);

  const allCertsHaveExpiration = selectedCerts.every(
    (certId) => expirationDates[certId]?.trim()
  );

  const hasChanges =
    form.name !== originalData.name ||
    form.email !== originalData.email ||
    JSON.stringify(selectedAbilities.sort()) !==
      JSON.stringify(originalAbilities.sort()) ||
    (selectedCerts.length > 0 && allCertsHaveExpiration);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const basicInfoChanged =
      form.name !== originalData.name || form.email !== originalData.email;
    const abilitiesChanged =
      JSON.stringify(selectedAbilities.sort()) !==
      JSON.stringify(originalAbilities.sort());

    if (basicInfoChanged || abilitiesChanged) {
      setShowModal(true);
    } else {
      confirmUpdate();
    }
  };

  const confirmUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BACK}/employees/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            pass: password,
          }),
        }
      );

      const data = await response.json();

      if (data.msg === "Employee info updated") {
        const newAbilities = selectedAbilities
          .filter((id) => !originalAbilities.includes(id))
          .filter((id) => typeof id === "number" && !isNaN(id));

        for (const abilityId of newAbilities) {
          console.log("Sending abilityId:", abilityId);
          const res = await fetch(
            `${API_BACK}/employees/abilities`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token,
              },
              body: JSON.stringify({
                abilityId,
              }),
            }
          );

          const result = await res.json();
          console.log("Response status:", res.status);
          console.log("Response body:", result);
          if (!res.ok || result.error) {
            console.error("Failed to add ability:", result.error);
          }
        }

        alert("Profile successfully updated!");

        setUserData({
          ...form,
          abilities: selectedAbilities,
        });

        navigate("/profile");
      } else {
        alert(data.error || "Error updating profile.");
      }
    } catch (error) {
      console.error("PUT request error:", error);
      alert("Server connection error.");
    }

    for (const cert of selectedCerts) {
      const expiration = expirationDates[cert] || null;
      const res = await fetch(`${API_BACK}/employees/certifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          certificationId: cert,
          expiration,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        console.error("❌ Failed to add certification:", result.error);
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="header-title-wrapper">
            {collapsed && (
              <div className="sidebar-button-wrapper">
                <SidebarExpandButton setCollapsed={setCollapsed} />
              </div>
            )}
            <h2>Edit Profile</h2>
          </div>
          <p>Update your personal and professional information</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <h3 className="section-title">Ba  sic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  name="role"
                  type="text"
                  placeholder="Your job title"
                  value={form.role}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Assignment</label>
                <input
                  name="assigned"
                  type="text"
                  placeholder="e.g. 85%"
                  value={form.assigned}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Abilities</h3>
            <div className="form-group">
              <label>Select your abilities</label>
              <Select
                isMulti
                options={abilities.map((ability) => ({
                  value: ability.id,
                  label: ability.name,
                }))}
                value={abilities
                  .filter((ability) => selectedAbilities.includes(ability.id))
                  .map((a) => ({ value: a.id, label: a.name }))}
                onChange={(selectedOptions) => {
                  const selectedIds = selectedOptions.map((opt) => opt.value);
                  setSelectedAbilities(selectedIds);
                }}
                placeholder="Search and select your abilities..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Certifications</h3>
            <div className="form-group">
              <label>Select your certifications</label>
              <Select
                isMulti
                options={certOptions.map((cert) => ({
                  value: cert.id,
                  label: cert.name,
                }))}
                value={certOptions
                  .filter((cert) => selectedCerts.includes(cert.id))
                  .map((cert) => ({
                    value: cert.id,
                    label: cert.name,
                  }))}
                onChange={(selectedOptions) => {
                  const ids = selectedOptions.map((opt) => opt.value);
                  setSelectedCerts(ids);
                }}
                placeholder="Search and select certifications..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {selectedCerts.length > 0 && (
              <div className="form-group">
                <label>Set expiration date for each certification</label>
                {selectedCerts.map((certId) => {
                  const certName = certOptions.find((c) => c.id === certId)?.name || "";
                  return (
                    <div key={certId} className="cert-expiration-input">
                      <label>{certName}</label>
                      <input
                        type="date"
                        value={expirationDates[certId] || ""}
                        onChange={(e) =>
                          setExpirationDates({
                            ...expirationDates,
                            [certId]: e.target.value,
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={!hasChanges}
            >
              Save Changes
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="password-modal">
          <div className="edit-profile-page ">
            <h3>Confirm Changes </h3>
            <p>Please enter your password to confirm the changes</p>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <div className="modal-actions">
              <button onClick={confirmUpdate} className="confirm-button">
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
