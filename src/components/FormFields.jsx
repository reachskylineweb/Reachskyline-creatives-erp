import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Reusable Text, Password, Email, Date, and Number Input field
export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      
      {isPassword ? (
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${error ? 'error' : ''}`}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            style={{ paddingRight: '40px', width: '100%' }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`form-control ${error ? 'error' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...props}
        />
      )}
      
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  );
};

// Reusable Select Dropdown field
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [], // Array of objects: { value, label }
  error,
  required = false,
  disabled = false,
  emptyOptionLabel = 'Select an option',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`form-control ${error ? 'error' : ''}`}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="">{emptyOptionLabel}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  );
};

// Reusable Multi-line Text Area field
export const FormTextArea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  rows = 4,
  disabled = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`form-control ${error ? 'error' : ''}`}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  );
};
