import React, { useState, useEffect } from 'react';
import { changBin, changSelectBin, changUnBin, changeLike, changeUnLike, deleteById, fetchBinDetails, fetchLikeDetails, fetchUniqeFolders, fetchfolderNameDetails, fetchimageDetails } from '../Contaxt/ImageContaxt';
import './Style/AllPhotos.css'; // Corrected the import path
import folderImgg from '../Components/Assets/folderImg.png';
import { AddAPhotoOutlined, FolderOutlined, FavoriteBorder, DeleteOutline , ArrowBackSharp , Favorite , Restore , RadioButtonUnchecked , TaskAlt , ArrowCircleDown , KeyboardBackspace} from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoadingAnimation from './LoadingAnimation';
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
  const [isSelect , setIsSelect] = useState(false);
  const [selectItems , setSelectItems] = useState([]);
  const [photoState, setPhotoState] = useState({});
  const [folderState, setFolderState] = useState({});
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {
    const initialState = {};
    if(detailsPhotos){
      detailsPhotos.forEach(photo => {
        initialState[photo._id] = false;
      });
      setPhotoState(initialState);
    }
  
  }, [detailsPhotos]);
  console.log("photoState : ", photoState)
  useEffect(() => {
    const initialState = {};
    if(folderNameImgg){
      folderNameImgg.forEach(photo => {
        initialState[photo._id] = false;
      });
      setFolderState(initialState);
    }
  
  }, [folderNameImgg]);
console.log("folderState : ", folderState)
  const fetchPhotos = async () => {
    try {
      const response = await fetchimageDetails();
      setPhotos(response.data.photos);
      setLoading(false)
    } catch (err) {
      console.error("Error fetching images details", err);
      setLoading(false)
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

const  select_Delete = async() => {
  try {
    const response = await changSelectBin(selectItems);
    console.log("res : " , response)
    }
  catch (error) {
      console.error('Error update Selected photos details:', error);
  }
  setIsSelect(false)
  fetchPhotos();
}
const onSelectAll = async(e , item) => {
  e.stopPropagation();
  const initialState = {};
  if(item === "photo"){
    detailsPhotos.forEach(photo => {
      initialState[photo._id] = true;
    });
    await setPhotoState(initialState);
    const selectedIds = Object.keys(initialState).filter(id => initialState[id]);
    setSelectItems(selectedIds);
  }
  if(item === "folder"){
    console.log("okay ")
    folderNameImgg.forEach(photo => {
      initialState[photo._id] = true;
    });
    await setFolderState(initialState);
    const selectedIds = Object.keys(initialState).filter(id => initialState[id]);
    setSelectItems(selectedIds);
  }
  
}
const onUnSelectAll =(e , item) => {
  e.stopPropagation();
  const initialState = {};
  if(item === "photo"){
  detailsPhotos.forEach(photo => {
    initialState[photo._id] = false;
  });
  setPhotoState(initialState);
  setSelectItems([])}

  if(item === "folder"){
    folderNameImgg.forEach(photo => {
      initialState[photo._id] = false;
    });
    setFolderState(initialState);
    setSelectItems([])}

}
const onSelecttoBin =(e , id , item) => {
  e.stopPropagation();
  if(item === "photo"){
    setPhotoState(prevState => {
      const newState ={...prevState,
      [id]: !prevState[id] }
  
      const selectedIds = Object.keys(newState).filter(id => newState[id]);
      setSelectItems(selectedIds);
  
      return newState;
  });
  }
  if(item === "folder"){
    setFolderState(prevState => {
      const newState ={...prevState,
      [id]: !prevState[id] }
  
      const selectedIds = Object.keys(newState).filter(id => newState[id]);
      setSelectItems(selectedIds);
  
      return newState;
  });
  }
  

  // setIsSelected(true)
}
 
const onUnSelectBin = (e , id , item) => {
  e.stopPropagation();
  if(item === "photo"){
    setPhotoState(prevState => {
      const newState ={ ...prevState,
       [id]: false};
       const selectedIds = Object.keys(newState).filter(id => newState[id]);
       setSelectItems(selectedIds);
   
       return newState;
   });
  }
  if(item === "folder"){
    setFolderState(prevState => {
      const newState ={ ...prevState,
       [id]: false};
       const selectedIds = Object.keys(newState).filter(id => newState[id]);
       setSelectItems(selectedIds);
   
       return newState;
   });
  }
  
}

const photo_back = (e , item) => {
  if(item === "photo"){
  const updatedPhotoState = Object.keys(photoState).reduce((acc, id) => {
    acc[id] = false; 
    return acc;
  }, {});
  
  setPhotoState(updatedPhotoState);}

  if(item === "folder"){
    const updatedPhotoState = Object.keys(folderState).reduce((acc, id) => {
      acc[id] = false; 
      return acc;
    }, {});
    
  setFolderState(updatedPhotoState);}
  setSelectItems([])
  setIsSelect(false)
}
const allSelected = Object.values(photoState).every(value => value);
const allFolderSelected = Object.values(folderState).every(value => value);

console.log("isSelect :", selectItems)
  return (
    <>
      <div className="photoBody">
        {loading ? <LoadingAnimation />  :  
        ( currentView === 'photos' 
        ? (
          <div>
            <h1>Pictures</h1>
            {detailsPhotos ? ( !isSelect ? 
              <button onClick={() => setIsSelect(true)} className='select'>Select <ArrowCircleDown /></button>  : 
              <div className='selectDelete'>
                <div className='deleteAll'>
                  {isSelect && 
                  (!allSelected 
                  ? <button className=' bacicon ' onClick={(e) => onSelectAll(e , "photo")}><RadioButtonUnchecked /></button> 
                  : <button className=' bacicon' onClick={(e) => onUnSelectAll(e, "photo")}><TaskAlt style={{color:"rgb(212, 48, 7)"}}/></button>) 
                  }
                  <button className=' bacicon ' style={{color:"black"}} onClick={(e) => photo_back(e , "photo")}><KeyboardBackspace />All</button>
                  {/* <h6><KeyboardBackspace />All</h6> */}
                </div>
                <h3 >{selectItems.length <= 0 ?  'Select items' : 
                  <div className='deleteAll'>
                    <button className=' bacicon' style={{color:"red"}}  onClick={select_Delete}><DeleteOutline  className="icon-large"/></button>
                    <h6>{isSelect ? selectItems.length : null} selected</h6>
                  </div> }
                </h3> 
              </div>
            ):(null)
            }
             <div className="photos-container">
                {detailsPhotos && detailsPhotos.length > 0 ? (
                  detailsPhotos.map(photo => (
                    <div key={photo._id} className="photo-item" onClick={() => openModal(photo)}>
                      <div className='radioIcon'> 
                        {isSelect && 
                          (!photoState[photo._id] 
                          ? <button className=' bacicon ' onClick={(e) => onSelecttoBin(e , photo._id , "photo")}><RadioButtonUnchecked /></button> 
                          : <button className=' bacicon' onClick={(e) => onUnSelectBin(e , photo._id , "photo")}><TaskAlt style={{color:"rgb(212, 48, 7)"}}/></button>)
                         }
                      </div>
                      <img src={photo.photoUrl} alt='photo' className='img-fluid'/>
                      <div className="imgIcons"> 
                        {photo.likeStatus === 'unlike' ? ( 
                          <button className=' bacicon' onClick={(e) => onLike(photo._id , e , null)}><FavoriteBorder className="icon heart-icon" /></button>
                        ) : (  
                          <button className=' bacicon' onClick={(e) => onUnLike(photo._id , e , null)}><Favorite className="icon heart-icon" style={{color:"rgb(212, 48, 7)"}}/></button>
                        )}
                         <button className=' bacicon' onClick={(e) => onBin(photo._id ,e , null)}><DeleteOutline className="icon delete-icon" /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No photos available</p>
                )}
             </div>
          </div>) 
          : (
          currentView === 'folder' ? (
            !folderImg ? (
              <div >
                <h1 >Folders</h1>
                <div className='allbox' style={{position:"relative" , bottom:"60px"}}>
                  {folderName.length > 0 ? (
                    folderName.map(folder => (
                      <div key={folder} className="text-center" >
                        <button className='folderBtn' onClick={() => folderImgShow(folder)}><img src={folderImgg} alt='folder' /></button>
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
                <button className=' backicon' onClick={onBack}><ArrowBackSharp />Back to folder</button>
                {/* 00 */}
                {folderNameImgg ? ( !isSelect ? 
              <button onClick={() => setIsSelect(true)} className='selects'>Select <ArrowCircleDown /></button>  : 
              <div className='selectDeletes'>
                <div className='deleteAll'>
                  {isSelect && 
                  (!allFolderSelected 
                  ? <button className=' bacicon ' onClick={(e) => onSelectAll(e , "folder")}><RadioButtonUnchecked /></button> 
                  : <button className=' bacicon' onClick={(e) => onUnSelectAll(e, "folder")}><TaskAlt style={{color:"rgb(212, 48, 7)"}}/></button>) 
                  }
                  <button className=' bacicon ' style={{color:"black"}} onClick={(e) => photo_back(e , "folder")}><KeyboardBackspace />All</button>
                </div>
                <h3 >{selectItems.length <= 0 ?  'Select items' : 
                  <div className='deleteAll'>
                    <button className=' bacicon' style={{color:"red"}}  onClick={select_Delete}><DeleteOutline  className="icon-large"/></button>
                    <h6>{selectItems.length} selected</h6>
                  </div> }
                </h3> 
              </div>
            ):(null)
            }
            {/* 00 */}
                <div className="photos-container">
                  {folderNameImgg && folderNameImgg.length  > 0 ? (
                    folderNameImgg.map(image => (
                      <div key={image._id} className="photo-items" onClick={() => openModal(image)}>
                        <div className='radioIcon'> 
                          {/* 00 */}
                        {isSelect && 
                          (!folderState[image._id] 
                          ? <button className=' bacicon ' onClick={(e) => onSelecttoBin(e , image._id , "folder")}><RadioButtonUnchecked /></button> 
                          : <button className=' bacicon' onClick={(e) => onUnSelectBin(e , image._id , "folder")}><TaskAlt style={{color:"rgb(212, 48, 7)"}}/></button>)
                         }
                        </div>
                        {/* 00 */}
                        <img src={image.photoUrl} alt='photo' className='img-fluid'/>
                        <div className="imgIcons">
                          {image.likeStatus === 'unlike' ? ( 
                                <button className=' bacicon' onClick={(e) => onLike(image._id , e , image.folderName)}><FavoriteBorder className="icon heart-icon" /></button>
                              ) : (  
                                <button className=' bacicon' onClick={(e) => onUnLike(image._id , e , image.folderName)}><Favorite className="icon heart-icon" /></button>
                          )}
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
                          <button className=' bacicon' onClick={(e) => onUnLike(liked._id , e , null )}><Favorite className="icon heart-icon" style={{color:"rgb(212, 48, 7)"}}/></button>
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
            ))))}
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

