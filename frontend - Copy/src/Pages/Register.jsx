import React, { useState } from 'react';
import register from '../Components/Style/Register.css'
import { Link, useNavigate } from 'react-router-dom';
import { checkRegister } from '../Contaxt/UserContaxt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Register = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
user_name: '',
user_address: '',
phone_no: '',
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
        const response = await checkRegister(formData);
        if(response.data.success === true){
          toast.success("Register Success", {
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
          const token = response.data.jwtToken;
          localStorage.setItem('token',token);
          setTimeout(() => {
            navigate('/action');
          }, 1500);
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
          user_name: '',
          user_address: '',
          phone_no: '',
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
  }
else {
  setErrors(validationErrors);
}
};

const validateForm = (data) => {
  let errors = {};

  if (!data.user_name.trim()) {
    errors.user_name = 'Username is required';
  } else if (data.user_name.length > 20) {
    errors.user_name = 'Username must be less than 20 characters';
  }

  if (!data.user_address.trim()) {
    errors.user_address = 'Address is required';
  }

  if (!data.phone_no.trim()) {
    errors.phone_no = 'Phone number is required';
  } else if (!/^\d{10}$/.test(data.phone_no)) {
    errors.phone_no = 'Phone number must be 10 digits';
  }

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
<div className="registration-form">
<h2>Register</h2>
<form onSubmit={handleSubmit}>
<div className="form-group">
<input
         type="text"
         id="user_name"
         name="user_name"
         value={formData.user_name}
         onChange={handleChange}
         placeholder='Username'
       />
{errors.user_name && <div className="error">{errors.user_name}</div>}
</div>


    <div className="form-group">
      <input
        type="text"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder='Email'
      />
      {errors.email && <div className="error">{errors.email}</div>}
    </div>
    
    <div className="form-group">
      <input
        type="text"
        id="address"
        name="user_address"
        value={formData.user_address}
        onChange={handleChange}
        placeholder='Address'
      />
      {errors.user_address && <div className="error" >{errors.user_address}</div>}
    </div>

    <div className="form-group">
      <input
        type="text"
        id="phone_no"
        name="phone_no"
        value={formData.phone_no}
        onChange={handleChange}
        placeholder='Phone Number'
      />
      {errors.phone_no && <div className="error">{errors.phone_no}</div>}
    </div>

    <div className="form-group">
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder='Password'
      />
      {errors.password && <div className="error">{errors.password}</div>}
    </div>

    <button type="submit" className="btn">Register</button>
  </form>
  <div className="login-link">
    <p>Already have an account? <Link to="/login" className="login">Signin</Link></p>
  </div>
  <ToastContainer />
</div>
);
};

export default Register;












