import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { requestPasswordReset } from '../Contaxt/UserContaxt';
import '../Components/Style/Login.css';
import 'react-toastify/dist/ReactToastify.css'; 
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState({});

  const validateEmail = (email) => {
    let error = {};

    if (!email.trim()) {
      error.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = 'Email address is invalid';
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateForm = validateEmail(email);
    if (Object.keys(validateForm).length === 0) {
      try {
        const response = await requestPasswordReset({ email });
        if (response.data.success) {
          toast.success('Password reset link sent to your email', {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setEmail('');
          navigate('/')
        } else {
          toast.error(response.data.error, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.error('Failed to send password reset email. Please try again later.', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      setError(validateForm);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError({});
            }}
            placeholder="Enter your email"
          />
          {error.email && <div className="error">{error.email}</div>}
        </div>
        <button type="submit" className="btn">Submit</button>
      </form>
      <div className="login-link">
      <Link to = '/login' className="login " style={{marginLeft:"5px"}}><i className="fas fa-arrow-left" style={{ marginRight: "5px" }}></i>Signin</Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
