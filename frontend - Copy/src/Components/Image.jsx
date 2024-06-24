import React, { useState } from 'react'
import image from './Style/Image.css'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCamera, faEdit, faEye, faRemove, faRightLeft, faRightLong, faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import BottomNav from './BottomNav';

const Image = () => {
  const [view , setView] = useState('photos')
  const [imageUpload , setImageupload] = useState(false)
  const handleViewChange = (newView) => {
    setView(newView)
    setImageupload(false)
  }

  return (
    <>
    <div className="contain">
    <Navbar />
    <div className='photo'>
      <div className='imgBody'>
         <div className='imgAddIcon'>
          <FontAwesomeIcon icon={faAdd} />
         </div>
         <div className='displayContent' >
         {/* style={{width:"98.5vw" , minHeight:"100vh" , background: "red" }} */}

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