import axios from 'axios'
import {jwtDecode} from 'jwt-decode';

import React, { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:4000/api/photo';


export const fetchUniqeFolders = async() => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.get(`${BASE_URL}/getFolders`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }
  
export const fetchLikeDetails = async() => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.get(`${BASE_URL}/getLikes`, {
         headers: { Authorization: `Bearer ${token}` }
       });
      //  console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  
   
export const fetchfolderNameDetails = async(folder) => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.get(`${BASE_URL}/getByFolder/${folder}`, {
         headers: { Authorization: `Bearer ${token}` }
       });
      //  console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  
   
export const changeLike = async(_id) => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.put(`${BASE_URL}/changeLikeStatus/${_id}`);
      //  console.log("rescccc : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  

export const changeUnLike = async(_id) => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.put(`${BASE_URL}/changeUnLikeStatus/${_id}`);
      //  console.log("rescccc : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  
   
   export const changSelectBin = async(ids) => {
      console.log("ids:" ,ids)
     try{
       const response = await axios.put(`${BASE_URL}/selectedDeleteStatus` , ids);
       console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  
export const changBin = async(_id) => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.put(`${BASE_URL}/updateDeleteStatus/${_id}`);
       console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  

export const changUnBin = async(_id) => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.put(`${BASE_URL}/updateUnDeleteStatus/${_id}`);
       console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  
export const fetchBinDetails = async() => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.get(`${BASE_URL}/getDeleteStatus`, {
         headers: { Authorization: `Bearer ${token}` }
       });
      //  console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }  

export const deleteById = async(_id) => {
  const token = localStorage.getItem('token');
   try{
     const response = await axios.delete(`${BASE_URL}/delete/${_id}`);
    //  console.log("res : ", response);
     return response
   }
   catch (error) {
     console.error("Error:", error);
   }
 } 
export const fetchimageDetails = async() => {
    const token = localStorage.getItem('token');
     try{
       const response = await axios.get(`${BASE_URL}/get`, {
         headers: { Authorization: `Bearer ${token}` }
       });
    //    console.log("res : ", response);
       return response
     }
     catch (error) {
       console.error("Error:", error);
     }
   }   
export const uploadImages = async (files, folderName) => {
    const token = localStorage.getItem('token');
    console.log("files: ", files);
    console.log("folderName: ", folderName);

    const formData = new FormData();
    formData.append('folderName', folderName);
    files.forEach((file, index) => {
        formData.append('images', file);
    });

    // Log the FormData contents for debugging
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        const response = await axios.post(`${BASE_URL}/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("response: ", response.data);
        return response;
    } catch (error) {
        console.error("Error:", error);
    }
};
