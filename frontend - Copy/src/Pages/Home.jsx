import React from 'react'
import home from '../Components/Style/Home.css'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <div className="homepage">
    <div className="content">
      <h1 className="title">Welcome to Image App Store</h1>
        <div className="buttons">
        <Link to="/register" className="btn signup">
            <i className="fas fa-user-plus"></i> Signup
          </Link>
          <Link to="/login" className="btn signin">
            <i className="fas fa-sign-in-alt"></i> Signin
          </Link>
        </div>
    </div>
  </div>
  )
}

export default Home