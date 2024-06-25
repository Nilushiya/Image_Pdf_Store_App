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
                const uploadDate = new Date();
                const imageSize = formatBytes(file.size);

                console.log({
                    userId,
                    photoUrl,
                    folderName,
                    likeStatus,
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
