import React from 'react';

const InputField = ({ label, error, ...props }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputField;
