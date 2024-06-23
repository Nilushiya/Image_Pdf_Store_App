import React, { useState } from 'react';
import login from '../Components/Style/Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { checklogin } from '../Contaxt/UserContaxt';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await checklogin(formData);
        if(response.data.success === true){
          toast.success("Login Success", {
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
          const token = response.data.jwtToken;
          // console.log("token : ",token);
          localStorage.setItem('token',token);
          setTimeout(() => {
            navigate('/action');
          }, 1000);
        }
        if(response.data.success === false){
          toast.error(response.data.error, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined});
        }
          
        setFormData({
              email: '',
              password: ''
            });
        setErrors({});
      } catch (error) { 
        // console.log('exit else :')

        toast.error('Registration failed. Please try again later.', {
          autoClose: 2000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined});
        // console.error('Registration failed:', error);
      }
    } else {
      
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <button type="submit" className="btn">Signin</button>
      </form>
      <div className="login-link">
        <p>Already  don't have an account? <Link to="/register" className="signup">Signup</Link></p>
      </div>
      <div className="loginpass">
      <Link to="/forgotPassword" className="forgot_password"><p>forgot password?</p></Link>
      </div>
    </div>
  );
};

export default Login;
