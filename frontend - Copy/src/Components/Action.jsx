import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addOrUpdateProfileImage, decodeToken, deleteProfile, deleteUser, edituser, getUserDetails } from '../Contaxt/UserContaxt';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCamera, faEdit, faEye, faRemove, faRightLeft, faRightLong, faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import './Style/Action.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Action = () => {
  const navigate = useNavigate();
  const [user_name, setUser_name] = useState('');
  const [name_firstLetter, setName_firstLetter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [proImg, setProImg] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editUserDetails, setEditUserDetails] = useState({
    user_name: '',
    user_address: '',
    phone_no: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const decode = decodeToken();
    const user_name = decode.user_name;
    setUser_name(user_name);
    const firstLetter = user_name.charAt(0).toUpperCase();
    setName_firstLetter(firstLetter);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData.data.user);
        setEditUserDetails({
          user_name: userData.data.user.user_name,
          user_address: userData.data.user.user_address,
          phone_no: userData.data.user.phone_no
        });
      } catch (err) {
        console.error("Error fetching user details", err);
      }
    };
    fetchUserDetails();
  }, []);

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleEdit = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleImgEdit = () => setProImg(true);
  const handleImgClose = () => setProImg(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Error deleting user details', err);
    }
  };

  const handleDetailsEdit = async () => {
    try {
      await edituser(editUserDetails);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        ...editUserDetails
      }));
      setEditModal(false);
    } catch (err) {
      console.error('Error updating user details', err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfileImageUpdate = async () => {
    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    try {
      const response = await addOrUpdateProfileImage(formData);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profile_image: response.data.profile_image
      }));
      setProImg(false);
    } catch (err) {
      console.error('Error updating profile image', err);
    }
  };

  const handleProfileImageRemove = async () => {
    try {
      const response = await deleteProfile();
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profile_image: null
      }));
      setProImg(false);
    } catch (err) {
      console.error('Error removing profile image', err);
    }
  };

  return (
    <>
      <div className="container">
        <Navbar />
        {userDetails.profile_image ? (
          <div className='profile-circle' style={{ backgroundImage: `url(${userDetails.profile_image})` }}>
          </div>
        ) : (
          <div className='profile-letter'>
            {name_firstLetter}
          </div>
        )}
        <div className="profile-actions">
          <button className="icon-button" onClick={handleShow}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button className="icon-button" onClick={handleImgEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
        <h1 className="heading">Choose an Action</h1>
        <div className="button-container">
          <Link className="animated-button" to='/image'>Image</Link>
          {/* <Link className="animated-button" to='/pdf'>PDF</Link> */}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered className='model'>
        <div className='modelbox'>
          <h1 className='head' style={{ color: "white" }}> <FontAwesomeIcon icon={faUser} /></h1>
          {userDetails && (
            <div>
              <p>Username: {userDetails.user_name}</p>
              <p>Address: {userDetails.user_address}</p>
              <p>Email: {userDetails.phone_no}</p>
            </div>
          )}
          <div className='pro_btn'>
            <div>
              <button className="icon" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="iconn" onClick={handleDelete}>
                Delete Account
              </button>
            </div>
            <Button variant="secondary" onClick={handleClose} className='modelFooter '>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal show={editModal} onHide={handleEditClose} centered className='model'>
        <div className='modelbox'>
          <h1 className='head' style={{ color: "white" }}> <FontAwesomeIcon icon={faUser} /></h1>
          <form className='editDetails'>
            <label>Username</label>
            <input
              type="text"
              name="user_name"
              value={editUserDetails.user_name}
              onChange={handleInputChange}
            />
            <label>Address</label>
            <input
              type="text"
              name="user_address"
              value={editUserDetails.user_address}
              onChange={handleInputChange}
            />
            <label>Phone No</label>
            <input
              type="text"
              name="phone_no"
              value={editUserDetails.phone_no}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleDetailsEdit} className=' save'>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </form>
          <Button variant="secondary" onClick={handleEditClose} className='modelFooter button'>
            Close
          </Button>
        </div>
      </Modal>

      <Modal show={proImg} onHide={handleImgClose} centered className='model'>
        <div className='modelbox'>
          <h1 className='head' style={{ color: "white" }}> <FontAwesomeIcon icon={faCamera} /></h1>
          {userDetails.profile_image ? (
            <>
              <input type="file" onChange={handleFileChange} style={{color:'red', width:"250px" , margin:'5% 12%' ,border:'none' , borderRadius:'10px'}}/>
              <div className="update">
              <button className='iconnn' onClick={handleProfileImageUpdate}>Update</button>
              <button className='iconnn' onClick={handleProfileImageRemove}>Remove</button>
              </div>
            </>
          ) : (
            <>
              <input type="file" onChange={handleFileChange} style={{color:'red', width:"250px" , margin:'5% 12%' ,border:'none' , borderRadius:'10px'}}/>
              <button className='save' onClick={handleProfileImageUpdate} > <FontAwesomeIcon icon={faAdd} /></button>
            </>
          )}
          <Button variant="secondary" onClick={handleImgClose} className='modelFooter button'>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Action;
