import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { resetPassword } from '../Contaxt/UserContaxt';
import { useParams, useNavigate } from 'react-router-dom';
import login from '../Components/Style/Login.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await resetPassword({ ...formData, token });
        if(response.data.success){
          toast.success('Password reset successful', {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          toast.error(response.data.error, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      } catch (error) {
        toast.error('Failed to reset password. Please try again later.', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!data.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  return (
    <div className="reset-password-form">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" className="btn">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
