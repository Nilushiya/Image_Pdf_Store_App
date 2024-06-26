import React, { useState, useEffect } from 'react';
import uploadImg from './Style/uploadImgForm.css';
import { fetchUniqeFolders, uploadImages } from '../Contaxt/ImageContaxt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const UploadImgForm = () => {
    const [files, setFiles] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [existingFolders, setExistingFolders] = useState([]);
    const [isNewFolder, setIsNewFolder] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await fetchUniqeFolders();
            const folderNames = response.data.uniqueFolderNames.map(folder => folder.folderName);
            setExistingFolders(folderNames);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 10) {
          toast.error('Max you can upload 10 photos.', {
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined});
            e.target.value = null; 
            return;
        }

        setFiles(selectedFiles);
    };

    const validateForm = (files , folderName) => {
      let errors = {}
      if (files.length === 0) {
        errors.files = 'file requied'
      }
      if (!folderName) {
        errors.folderName = 'folderName requried.'
      }
      return errors ; 
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(files , folderName);
        if (Object.keys(validationErrors).length === 0){ 
            try {
              const response = await uploadImages(files, folderName);
              console.log('Upload response:', response);
              setFiles([]);
              setFolderName('');

              fetchFolders();
          } catch (error) {
              console.error('Error uploading images:', error);
          }
        }
        else{
          setErrors(validationErrors)
        }

    };

    const handleFolderChange = (e) => {
        const { value } = e.target;
        setIsNewFolder(value === 'new');
        setFolderName(value === 'new' ? '' : value);
    };

    return (
        <>
            <div className='uploadBody'>
                <div className='uploadHead'>
                    <h1>Upload Images</h1>
                    <p>{files.length}</p>
                </div>
                <form className="upload-form" onSubmit={handleSubmit}>
                <div className='folder'>
                        <select onChange={handleFolderChange} value={isNewFolder ? 'new' : folderName}>
                            <option value="" disabled>Select Folder</option>
                            {existingFolders.map((folder) => (
                                <option key={folder} value={folder}>
                                    {folder}
                                </option>
                            ))}
                            <option value="new">Create New Folder</option>
                        </select>
                        {isNewFolder && (
                            <input
                                className='folder_input'
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="New Folder Name"
                                // required
                            />
                        )}
                        {errors.folderName && <div className="error">{errors.folderName}</div>}
                    </div>
                    <div className='file'>
                    <input
                        type="file"
                        name='images'
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                    {errors.files && <div className="error">{errors.files}</div>}
                    </div>
                    <button type="submit" className='btn' style={{ width: "90px" }}>Upload</button>
                </form>
            </div>
        </>
    );
};

export default UploadImgForm;
