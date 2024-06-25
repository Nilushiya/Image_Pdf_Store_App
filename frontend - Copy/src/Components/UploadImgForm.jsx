import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import uploadImg from './Style/uploadImgForm.css';

const UploadImgForm = () => {
    const [files, setFiles] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [existingFolders, setExistingFolders] = useState([]);
    const [isNewFolder, setIsNewFolder] = useState(false);

    useEffect(() => {
        // Fetch existing folder names from the server or API
        const fetchFolders = async () => {
            // Replace with your API call
            const response = await fetch('/api/folders');
            const data = await response.json();
            setExistingFolders(data);
        };

        fetchFolders();
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 10) {
            alert('Max you can upload 10 photos');
            return;
        }
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await uploadImg(files, folderName);
        // Handle response if necessary
    };

    const handleFolderChange = (e) => {
        if (e.target.value === 'new') {
            setIsNewFolder(true);
            setFolderName('');
        } else {
            setIsNewFolder(false);
            setFolderName(e.target.value);
        }
    };

    return (
        <>
            <div className='uploadBody'>
                <div className='uploadHead'>
                    <h1>Upload Images</h1>
                    <p>4</p>
                </div>
                <form className="upload-form" onSubmit={handleSubmit}>
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
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="New Folder Name"
                            required
                        />
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                    <button type="submit" className='btn' style={{ width: "90px" }}>Upload</button>
                </form>
            </div>
        </>
    );
};

export default UploadImgForm;
