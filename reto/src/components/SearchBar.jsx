// src/components/SearchBar.js
import React from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <Form.Control
      type="search"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={onChange}
      style={{
        width: '200px',
        height: '36px',
        borderRadius: '18px',
        borderColor: '#6f42c1',
        boxShadow: 'none',
        paddingLeft: '15px',
      }}
      aria-label="Search"
    />
  );
};

export default SearchBar;
