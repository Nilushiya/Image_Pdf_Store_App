import React, { useState, useEffect } from 'react';
import { fetchBinDetails, fetchLikeDetails, fetchUniqeFolders, fetchimageDetails } from '../Contaxt/ImageContaxt';
import './Style/AllPhotos.css'; // Corrected the import path
import folderImg from '../Components/Assets/folderImg.png';
const AllPhotos = ({ view }) => {
  const [currentView, setCurrentView] = useState(view);
  const [detailsPhotos, setPhotos] = useState([]);
  const [folderName , setFolderName] = useState([]);
  const [likedPhoto , setLikedPhoto] = useState([]);
  const [binedPhoto , setBinedPhoto] = useState([]);


  useEffect(() => {
    setCurrentView(view);

    if (view === 'photos') {
      fetchPhotos();
    }
    if (view === 'folder'){
      fetchFolder();
    }
    if (view === 'like'){
      console.log("folder if")
      fetchLike();
    }
    if (view === 'delete'){
      fetchBin();
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

    try {
        const response = await fetchUniqeFolders();
        const folderNames = response.data.uniqueFolderNames.map(folder => folder.folderName);
        setFolderName(folderNames);
    } catch (error) {
        console.error('Error fetching folders:', error);
    }
};

const fetchLike = async () => {

  try {
      const response = await fetchLikeDetails();
      const LikedPhotos = response.data.likedPhotos;
      setLikedPhoto(LikedPhotos);
  } catch (error) {
      console.error('Error fetching liked photos details:', error);
  }
};

const fetchBin = async () => {

  try {
      const response = await fetchBinDetails();
      const binedPhotos = response.data.bindPhotos;
      console.log("folder if dele",binedPhotos)
      setBinedPhoto(binedPhotos);
  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
};

  return (
    <>
      <div className="photoBody">
        {currentView === 'photos' ? (
         <div>
          <h1>Pictures</h1>
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
          </div>
        ) : (
          currentView === 'folder' ? (
            <div className="row">
              <h1>Folders</h1>
              {folderName.length > 0 ? (
                folderName.map(folder => (
                  <div key={folder} className="col-lg-1 col-md-4 col-sm-6 mb-4 text-center">
                    <button className='folderBtn'><img src={folderImg} alt='folder' className="img-fluid"/></button>
                    <h1 className="h5 mt-2">{folder}</h1>
                  </div>
                ))
              ) : (
                <p>No folder available</p>
              )}
            </div>
          ) : (
            currentView === 'like' ? (
              <div>
               <h1>Favourites</h1>
                  <div className="photos-container">
                     {likedPhoto.length > 0 ? (
                       likedPhoto.map(liked => (
                         <div key={liked._id} className="photo-item">
                           <img src={liked.photoUrl} alt='photo' />
                         </div>
                       ))
                     ) : (
                       <p>No Liked photos available</p>
                     )}
                   </div>
               </div>
             ) : (
              currentView === 'delete' ? (
                <div>
                 <h1>Recycle bin</h1>
                    <div className="photos-container">
                       {binedPhoto.length > 0 ? (
                         binedPhoto.map(bined => (
                           <div key={bined._id} className="photo-item">
                             <img src={bined.photoUrl} alt='photo' />
                           </div>
                         ))
                       ) : (
                         <p>No deleteded photos available</p>
                       )}
                     </div>
                 </div>
               ) : (
                null
              )
            )
          )
        )}
      </div>
    </>
  );
};

export default AllPhotos;

