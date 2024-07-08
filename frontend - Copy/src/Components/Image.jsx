import React, { useState } from 'react'
import image from './Style/Image.css'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCamera, faEdit, faEye, faRemove, faRightLeft, faRightLong, faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import { AddPhotoAlternate} from '@mui/icons-material';
import BottomNav from './BottomNav';
import UploadImgForm from './UploadImgForm';
import AllPhotos from './AllPhotos';

const Image = () => {
  const [view , setView] = useState('photos')
  const [imageUpload , setImageupload] = useState(false)
  const handleViewChange = (newView) => {
    setView(newView)
    setImageupload(false)
  }
  const handleAddButtonClick = () => {
    setImageupload(true)
  }
  return (
    < >
    <div className="contain">
    <Navbar />
    <div className='photo'>
      <div className='imgBody'>
         <div className='imgAddIcon'>
            <button className="add-button" onClick={handleAddButtonClick}><AddPhotoAlternate className="icon-large"/></button>
         </div>
         <div className='displayContent' >
            {imageUpload ? 
              (<UploadImgForm />) :
              (<AllPhotos  view = {view}/>)
              // null
            }
         </div>
      </div>
      <div className='imgfooter'>
        <BottomNav onViewChange = {handleViewChange}/>
      </div>
    </div>
    </div>
    </>
  )
}

export default Image