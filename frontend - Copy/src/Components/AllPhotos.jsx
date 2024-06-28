import React, { useState, useEffect } from 'react';
import { changBin, changUnBin, changeLike, changeUnLike, deleteById, fetchBinDetails, fetchLikeDetails, fetchUniqeFolders, fetchfolderNameDetails, fetchimageDetails } from '../Contaxt/ImageContaxt';
import './Style/AllPhotos.css'; // Corrected the import path
import folderImgg from '../Components/Assets/folderImg.png';
import { AddAPhotoOutlined, FolderOutlined, FavoriteBorder, DeleteOutline , ArrowBackSharp , Favorite , Restore} from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const AllPhotos = ({ view }) => {
  const [currentView, setCurrentView] = useState(view);
  const [detailsPhotos, setPhotos] = useState([]);
  const [folderName , setFolderName] = useState([]);
  const [likedPhoto , setLikedPhoto] = useState([]);
  const [binedPhoto , setBinedPhoto] = useState([]);
  const [folderNameImgg , setFolderNameImg] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderImg , setFolderImg] = useState(false);
  // const [ like , setLike] = useState(false);

  useEffect(() => {
    setCurrentView(view);

    if (view === 'photos') {
      fetchPhotos();
    }
    if (view === 'folder'){
      fetchFolder();
    }
    if (view === 'like'){
      // console.log("folder if")
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
const folderImgShow = async(folder) => {
  console.log("open");
  setFolderImg(true)
  try {
    const response = await fetchfolderNameDetails(folder);
    const folderNamePhotos = response.data.FolderByDetail;
    // console.log("folder if dele",response)
    setFolderNameImg(folderNamePhotos);
} catch (error) {
    console.error('Error fetching deleted photos details:', error);
}
}
const openModal = (photo) => {
  console.log('photo : ' , photo);
  setSelectedPhoto(photo);
  setIsModalOpen(true);
};

const closeModal = () => {
  setSelectedPhoto(null);
  setIsModalOpen(false);
};

const onBack = () => {
  setFolderImg(false)
}

const onLike = async(_id , e , folder) => {
  e.stopPropagation();
  // setLike(true);
  try {
    const response = await changeLike(_id);
    fetchPhotos();
    if(folder != 'null'){
  console.log("folder :",folder)
  folderImgShow(folder)
    }
  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
}

const onUnLike = async(_id , e , folder ) => {
  e.stopPropagation();
  
  // setLike(true);
  try {
    const response = await changeUnLike(_id);
    fetchPhotos();
    fetchLike();
    if(folder != 'null'){
  console.log("folder :",folder)
  folderImgShow(folder)
    }

  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
}

const onBin = async(_id , e , folder) => {
  e.stopPropagation();
  try {
    const response = await changBin(_id);
    fetchPhotos();
    if(folder != 'null'){
      console.log("folder :",folder)
      folderImgShow(folder)
        }
  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
}

const onUnDelete = async(_id , e) => {
  e.stopPropagation();
  try {
    const response = await changUnBin(_id);
    fetchBin();
  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
}

const onPermanateDelete = async(_id , e) => {
  e.stopPropagation();
  try {
    const response = await deleteById(_id);
    fetchBin();
  } catch (error) {
      console.error('Error fetching deleted photos details:', error);
  }
}
// console.log("like :", like)
  return (
    <>
      <div className="photoBody">
        { currentView === 'photos' ? (
         <div>
          <h1>Pictures</h1>
             <div className="photos-container">
                {detailsPhotos && detailsPhotos.length > 0 ? (
                  detailsPhotos.map(photo => (
                    <div key={photo._id} className="photo-item" onClick={() => openModal(photo)}>
                      <img src={photo.photoUrl} alt='photo' className='img-fluid'/>
                      <div className="imgIcons">
                         
                         {photo.likeStatus === 'unlike' ? ( 
                          <button className=' bacicon' onClick={(e) => onLike(photo._id , e , null)}><FavoriteBorder className="icon heart-icon" /></button>
                         ) : (  
                          <button className=' bacicon' onClick={(e) => onUnLike(photo._id , e , null)}><Favorite className="icon heart-icon" /></button>
                          )}
                         <button className=' bacicon' onClick={(e) => onBin(photo._id ,e , null)}><DeleteOutline className="icon delete-icon" /></button>
                    </div>
                     </div>
                  ))
                ) : (
                  <p>No photos available</p>
                )}
              </div>
          </div>
        ) : (
          currentView === 'folder' ? (
            !folderImg ? (
               <div >
              <h1>Folders</h1>
              <div className='allbox'>
                {folderName.length > 0 ? (
                  folderName.map(folder => (
                    <div key={folder} className="text-center" >
                      <button className='folderBtn' onClick={() => folderImgShow(folder)}><img src={folderImgg} alt='folder' className="img-fluid"/></button>
                      <h4 >{folder}</h4>
                    </div>
                  ))
                ) : (
                  <p>No folder available</p>
                )}
                </div>
            </div>
            )
            :(
              <div className='folImg'>
              <h1>Folder Images</h1>
              <button className=' backicon' onClick={onBack}><ArrowBackSharp className="icon-large"/>Back to folder</button>
              <div className="photos-container">
              {folderNameImgg.length  > 0 ? (
                folderNameImgg.map(image => (
                  <div key={image._id} className="photo-item" onClick={() => openModal(image)}>
                    <img src={image.photoUrl} alt='photo' className='img-fluid'/>
                    <div className="imgIcons">
                    {image.likeStatus === 'unlike' ? ( 
                          <button className=' bacicon' onClick={(e) => onLike(image._id , e , image.folderName)}><FavoriteBorder className="icon heart-icon" /></button>
                         ) : (  
                          <button className=' bacicon' onClick={(e) => onUnLike(image._id , e , image.folderName)}><Favorite className="icon heart-icon" /></button>
                    )}
                    {/* <button className=' bacicon' onClick={(e) => onUnLike(image._id , e , image.folderName)}><Favorite className="icon heart-icon" /></button> */}
                    {/* <button className=' bacicon' onClick={(e) => onLike(image._id , e , image.folderName)}><FavoriteBorder className="icon heart-icon" /></button> */}
                    <button className=' bacicon' onClick={(e) => onBin(image._id ,e  , image.folderName)}><DeleteOutline className="icon delete-icon" /></button>
                    </div>
                  </div>
                ))
              ) : (<p>No photos available</p>)} 
                </div>
            </div>
            ) 
           
          ) : (
            currentView === 'like' ? (
              <div>
               <h1>Favourites</h1>
                  <div className="photos-container">
                     {likedPhoto.length > 0 ? (
                       likedPhoto.map(liked => (
                         <div key={liked._id} className="photo-item" onClick={() => openModal(liked)}>
                           <img src={liked.photoUrl} alt='photo' className='img-fluid'/>
                           <div className="imgIcons">
                              <button className=' bacicon' onClick={(e) => onUnLike(liked._id , e , null )}><Favorite className="icon heart-icon" /></button>
                              <button className=' bacicon' onClick={(e) => onBin(liked._id ,e , null)}><DeleteOutline className="icon delete-icon" /></button>
                            </div>
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
                           <div key={bined._id} className="photo-item" onClick={() => openModal(bined)}> 
                             <img src={bined.photoUrl} alt='photo' className='img-fluid'/>
                             <div className="imgIcons">
                                <button className=' bacicon' onClick={(e) => onUnDelete(bined._id , e)}><Restore className="icon heart-icon" /></button>
                                <button className=' bacicon' onClick={(e) => onPermanateDelete(bined._id , e)}><DeleteOutline className="icon heart-icon" /></button>
                                {/* <Restore className="icon heart-icon" />
                                <DeleteOutline className="icon delete-icon" /> */}
                              </div>
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
      {isModalOpen && selectedPhoto && (
        <div className="modal" onClick={closeModal} style={{color:"red"}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedPhoto.photoUrl} alt='photo' className="full-screen-photo" />
          </div>
        </div>
      )}
    </>
  );
};

export default AllPhotos;

