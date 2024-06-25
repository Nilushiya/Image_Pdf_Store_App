const mongoose = require('mongoose');
const Photo = require('../model/Photo');

// Function to convert bytes to human-readable format
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

exports.uploadImage = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    const files = req.files;
    console.log("files:", files);
    if (!files || files.length === 0) {
        console.log("no files uploaded");
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const savedPhotos = [];
        for (const file of files) {
            try {
                console.log("Processing file:", file.originalname);

                const userId =new mongoose.Types.ObjectId(id);
                const photoUrl = `http://localhost:4000/${file.path}`;
                const folderName = req.body.folderName;
                const likeStatus = 'unlike';
                const DeleteStatus = 'not in bin';
                const uploadDate = new Date();
                const imageSize = formatBytes(file.size);

                console.log({
                    userId,
                    photoUrl,
                    folderName,
                    likeStatus,
                    DeleteStatus,
                    uploadDate,
                    imageSize
                });

                const photo = new Photo({
                    userId,
                    photoUrl,
                    folderName,
                    likeStatus,
                    uploadDate,
                    imageSize
                });

                console.log("Photo to be saved:", photo);

                const savedPhoto = await photo.save();
                console.log("Saved photo:", savedPhoto);
                savedPhotos.push(savedPhoto);
            } catch (innerError) {
                console.error(`Error processing file ${file.originalname}:`, innerError);
                return res.status(500).json({ message: `Error processing file ${file.originalname}`, error: innerError });
            }
        }

        console.log("All files processed successfully");
        res.json({ message: 'Images uploaded successfully', photos: savedPhotos });
    } catch (error) {
        console.error("Error uploading photos:", error);
        res.status(500).json({ message: 'Error uploading photos', error });
    }
};



exports.getImageDetails = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    try { 
        const isPhotoDetails = await Photo.find({ userId:new mongoose.Types.ObjectId(id) });

        if (isPhotoDetails.length === 0 ) {
            return res.json({
                message: "This user has not uploaded any images. Please upload the images.",
                success: false
            });
        }
        
        return res.json({
            message: "Photo details retrieved successfully.",
            success: true,
            photos: isPhotoDetails 
        });
    } catch (error) {
        console.error("Error getting photos and details:", error);
        res.status(500).json({ message: 'Error getting photos and details', error });
    }
};



exports.deleteImageDetails = async (req, res) => {
    const imgID = req.params.imgID;
    console.log("imgID:", imgID);

    try {
        // Validate if the imgID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(imgID)) {
            return res.status(400).json({
                message: "Invalid image ID.",
                success: false
            });
        }
        if(await Photo.find({ _id : imgID})){
            console.log(Photo.find({ _id : imgID}))
        }


        // Find and delete the photo by imgID
const photo = await Photo.findOneAndDelete({_id : imgID});
        console.log("photo:", photo);

        if (!photo) {
            return res.status(404).json({
                message: "Image not found.",
                success: false
            });
        }

        return res.json({
            message: "Image deleted successfully.",
            success: true,
            photo
        });
    } catch (error) {
        console.error("Error deleting photos and details:", error);
        res.status(500).json({ message: 'Error deleting photos and details', error });
    }
};
