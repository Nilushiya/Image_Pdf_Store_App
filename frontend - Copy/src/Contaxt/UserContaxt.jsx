import axios from 'axios'
import {jwtDecode} from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:4000/api';


export const getUserDetails = async() => {
 const token = localStorage.getItem('token');
//  console.log(token)
  try{
    const response = await axios.get(`${BASE_URL}/user/getUser`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // console.log("res : ",response)
    return response
  }
  catch (error) {
    console.error("Error:", error);
  }
}

export const edituser = async(data) => {
  const token = localStorage.getItem('token');
  // console.log(token)
   try{
     const response = await axios.put(`${BASE_URL}/user/edituser`,data, {
       headers: { Authorization: `Bearer ${token}` }
     });
    //  console.log("res : ",response)
     return response
   }
   catch (error) {
     console.error("Error:", error);
   }
 }
 
 export const deleteUser = async() => {
  const token = localStorage.getItem('token');
  // console.log(token)
   try{
     const response = await axios.delete(`${BASE_URL}/user/deleteUser`, {
      headers: { Authorization: `Bearer ${token}` }
    }); 
    //  console.log("res : ",response)
     return response
   }
   catch (error) {
     console.error("Error:", error);
   }
 }

export const addOrUpdateProfileImage = async(formData) => {
  const token = localStorage.getItem('token');
  console.log("formData : ", formData)
  try {
    const response = await axios.post(`${BASE_URL}/user/uploads`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }); 
    console.log("response : ",response.data);
    return response
  } 
  catch (error) {
    console.error("Error:", error);
  }
}

export const deleteProfile = async() => {
  const token = localStorage.getItem('token');
  // console.log(token)
   try{
     const response = await axios.delete(`${BASE_URL}/user/deleteProfile`, {
      headers: { Authorization: `Bearer ${token}` }
    }); 
    //  console.log("res : ",response)
     return response
   }
   catch (error) {
     console.error("Error:", error);
   }
 }





export const requestPasswordReset = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/request-password-reset`, data);
    // console.log("response : ",response.data);
    return response
  } 
  catch (error) {
    console.error("Error:", error);
  }
};

export const resetPassword = async (data) => {
  try{
    console.log("data:",data);
    const response = await axios.post(`${BASE_URL}/user/reset-password`, data);
    // console.log("response : ",response.data);
    return response
  }
  catch (error) {
    console.error("Error:", error);
  }
 
};



// Register
export const checkRegister = async(formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, formData);
      // console.log("response : ",response.data)

      return response
    } 
    catch (error) {
      console.error("Error:", error);
    }
  }
  // Login
export const checklogin = async(formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signin`, formData);
      // console.log("response : ",response.data)
      return response
    } 
    catch (error) {
      console.error("Error:", error);
    }
  }
  
  
    // Token
  export const decodeToken = () => {
    try{
      const token = localStorage.getItem('token');
      const decodeToken = jwtDecode(token);
      return decodeToken;
    }
    catch(err){
      return null;
    }
    
    }
