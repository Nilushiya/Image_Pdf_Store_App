import React, { useState } from 'react'
import Navbar from './Navbar';
import uploadImg from './Style/uploadImgForm.css'

const UploadImgForm = () => {
    const [files, setFiles] = useState([]);
    const [folderName, setFolderName] = useState('');
  
    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 10) {
        alert('Max you can upload 10 photos');
        return;
      }
      setFiles(selectedFiles);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (files.length > 10) {
        alert('Max you can upload 10 photos');
        return;
      }
    //   const newImages = files.map(file => ({
    //     url: URL.createObjectURL(file),
    //     name: file.name
    //   }));
    //   onUpload(newImages, folderName);
    };
  return (
    <>
        <div className='uploadBody'>
            <div className='uploadHead'>
                <h1>Upload Images</h1>
                <p>4</p>
            </div>
            <form className="upload-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={folderName} 
                    onChange={(e) => setFolderName(e.target.value)} 
                    placeholder="Folder Name" 
                    required 
                />
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    multiple 
                    accept="image/*" 
                />
                {/* <p>{files.length} / 10 images selected</p> */}
                <button type="submit" className='btn' style={{width:"90px" }}>Upload</button>
            </form>
        </div>
    </>
  )
}

export default UploadImgForm