import React from 'react';
import Select from 'react-select';
import '../styles/CreateNewUser.css';

const choices = [
  { value: 'TFS', label: 'TFS' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Usuario', label: 'Usuario' },
];

export default function CreateNewUser() {
  return (
    <div className="form-container">
      <form>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="nivel">Nivel:</label>
          <Select
            id="nivel"
            name="nivel"
            options={choices}
            className="custom-select"
            classNamePrefix="select"
          />
        </div>
        <button type="submit" className="submit-btn">Create User</button>
      </form>
    </div>
  );
}