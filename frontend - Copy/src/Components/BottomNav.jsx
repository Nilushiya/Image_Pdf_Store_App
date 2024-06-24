import React from 'react';
import { AddAPhotoOutlined, FolderOutlined, FavoriteBorder, DeleteOutline } from '@mui/icons-material';
import './Style/BottomNav.css';

const BottomNav = ({ onViewChange }) => {
  return (
    <div className="bottomNavbar">
      <button className='bottomBut' onClick={() => onViewChange('photos')}><AddAPhotoOutlined className="icon-large"/></button>
      <button className='bottomBut' onClick={() => onViewChange('folder')}><FolderOutlined className="icon-large"/></button>
      <button className='bottomBut' onClick={() => onViewChange('like')}><FavoriteBorder className="icon-large"/></button>
      <button className='bottomBut' onClick={() => onViewChange('delete')}><DeleteOutline className="icon-large"/></button>
    </div>
  );
}

export default BottomNav;
