import React from 'react'
import {  DeleteOutline ,  Restore } from '@mui/icons-material';


const Bin = ({binedPhoto , openModal, onUnDelete, onPermanateDelete}) => {
    // console.log("bindPhotos")
  return (
    <div>
        <h1>Recycle bin</h1>
        <div className="photos-container">
            {binedPhoto.length > 0 ? (
            binedPhoto.map(bined => (
                <div key={bined._id} className="photo-item" onClick={() => openModal(bined)}> 
                <img src={bined.photoUrl} alt='photo' className='img-fluid'/>
                <div className="imgIcons">
                    <button className=' bacicon' onClick={(e) => onUnDelete(bined._id , e)}><Restore className="icon heart-icon" /></button>
                    <button className=' bacicon' onClick={(e) => onPermanateDelete(bined._id , e)}><DeleteOutline className="icon heart-icon" /></button>
                </div>
                </div>
            ))
            ) : (
            <p>No deleteded photos available</p>
            )}
        </div>
    </div>
  )
}

export default Bin