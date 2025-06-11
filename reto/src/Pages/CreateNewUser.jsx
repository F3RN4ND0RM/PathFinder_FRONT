import React from 'react';
import Select from 'react-select';
import '../styles/CreateNewUser.css';

const choices = [
  { value: 1, label: '1: TFS' },
  { value: 2, label: '2: Manager' },
  { value: 3, label: '3: Usuario' },
];

export default function CreateNewUser() {
  const API_BACK = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [selectedNivel, setSelectedNivel] = React.useState(null);
  const [alert, setAlert] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const token = localStorage.getItem("authToken");
    const name = e.target.name.value;
    const email = e.target.email.value;

    if (!selectedNivel) {
      setAlert({ type: 'danger', msg: 'Select a level before continuing.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BACK}/employees/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          name,
          email,
          idlevel: selectedNivel.value,
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setAlert({ type: 'success', msg: result.msg });
      e.target.reset(); // limpia el formulario
      setSelectedNivel(null); // limpia el select

    } catch (error) {
      console.error("❌ Error:", error);
      setAlert({ type: 'danger', msg: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.msg}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="nivel">Level:</label>
          <Select
            id="nivel"
            name="nivel"
            options={choices}
            value={selectedNivel}
            onChange={setSelectedNivel}
            className="custom-select"
            classNamePrefix="select"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create user'}
        </button>
      </form>
    </div>
  );
}
