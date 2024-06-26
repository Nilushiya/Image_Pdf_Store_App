import React, { useState, useEffect } from 'react';
import { fetchUniqeFolders, fetchimageDetails } from '../Contaxt/ImageContaxt';
import './Style/AllPhotos.css'; // Corrected the import path
import folderImg from '../Components/Assets/folderImg.png';
const AllPhotos = ({ view }) => {
  console.log("name : ", view)
  const [currentView, setCurrentView] = useState(view);
  const [detailsPhotos, setPhotos] = useState([]);
  const [folderName , setFolderName] = useState([]);

  useEffect(() => {
    setCurrentView(view);

    if (view === 'photos') {
      fetchPhotos();
    }
    if (view === 'folder'){
      console.log("folder if")
      fetchFolder();
    }
  }, [view]);

  const fetchPhotos = async () => {
    try {
      const response = await fetchimageDetails();
      setPhotos(response.data.photos);
    } catch (err) {
      console.error("Error fetching images details", err);
    }
  };

  const fetchFolder = async () => {
    console.log("folder fun")

    try {
        const response = await fetchUniqeFolders();
        const folderNames = response.data.uniqueFolderNames.map(folder => folder.folderName);
        console.log("res:", folderNames);
        setFolderName(folderNames);
    } catch (error) {
        console.error('Error fetching folders:', error);
    }
};

  return (
    <>
      <div className="photoBody">
        {currentView === 'photos' ? (
          <div className="photos-container">
            {detailsPhotos.length > 0 ? (
              detailsPhotos.map(photo => (
                <div key={photo._id} className="photo-item">
                  <img src={photo.photoUrl} alt='photo' />
                </div>
              ))
            ) : (
              <p>No photos available</p>
            )}
          </div>
        ) : (
          currentView === 'folder' ? (
            <div className="row">
              {folderName.length > 0 ? (
                folderName.map(folder => (
                  <div key={folder} className="col-lg-1 col-md-4 col-sm-6 mb-4 text-center">
                    <img src={folderImg} alt='folder' className="img-fluid"  />
                    <h1 className="h5 mt-2">{folder}</h1>
                  </div>
                ))
              ) : (
                <p>No folder available</p>
              )}
            </div>
          ) : (
            null
          )
        )}
      </div>
    </>
  );
};

export default AllPhotos;

