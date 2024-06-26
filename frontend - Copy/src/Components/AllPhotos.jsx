import React, { useState, useEffect } from 'react';
import { fetchimageDetails } from '../Contaxt/ImageContaxt';

const AllPhotos = ({ view }) => {
  const [currentView, setCurrentView] = useState(view);
  const [detailsPhotos, setPhotos] = useState([]);


  useEffect(() => {
    setCurrentView(view);

    if (view === 'photos') {
      fetchPhotos();
    }
  }, [view]);

  const fetchPhotos = async() => {
    try {
      const response = await fetchimageDetails();
      // console.log("res : ", response.data.photos);
      setPhotos(response.data.photos);
    } catch (err) {
      console.error("Error fetching images details", err);
    }
  }
  console.log("data : " , detailsPhotos);
  return (
    <>
      {currentView === 'photos' ? (
        <div className="photos-container">
        {detailsPhotos.length > 0 ? (
          detailsPhotos.map(photo => (
            <div key={photo._id} className=" photo-item">
              <img src={photo.photoUrl} alt='photo' style={{ width: '400px', height: 'auto' }}  />
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
      ): (
        <p>No photos to display for the current view.</p>
      )}
    </>
  );
};

export default AllPhotos;
