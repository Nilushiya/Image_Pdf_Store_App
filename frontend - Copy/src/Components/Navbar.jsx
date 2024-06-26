import React from 'react'
import login from './Style/Login.css'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

  return (
    <div className="top-bar" >
        <Link className="home-icon" to='/action' ><i className="fas fa-home fa-2x"></i></Link>
        <div className="logout-icon" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt fa-2x" ></i>
        </div>
    </div>
  )
}

export default Navbar