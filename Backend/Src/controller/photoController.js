const Photo = require('../model/Photo')

exports.uploadImage = async(req , res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        try{
            const savedPhotos = [];
            for (const file of files) {
                const photo = new Photo({
                    userId: mongoose.Types.ObjectId(req.body.userId), 
                    photoUrl: file.path, 
                    folderName: req.body.folderName, 
                    likeStatus: 'unlike', 
                    uploadDate: new Date(),
                    imageSize: formatBytes(file.size) 
                });
    
                const savedPhoto = await photo.save();
                savedPhotos.push(savedPhoto);
            }
    
            res.status(201).json({ message: 'Images uploaded successfully', photos: savedPhotos });
        }
     catch (error) {
        res.status(500).json({ message: 'Error uploading photo', error });
    }
}