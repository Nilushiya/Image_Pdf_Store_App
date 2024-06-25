const mongoose = require('mongoose');
const Pdf = require('../model/Pdf');


// function formatBytes(bytes) {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

exports.uploadPdf = async (req, res) => {
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
        const savedpdfs = [];
        for (const file of files) {
            try {
                console.log("Processing file:", file.originalname);

                const userId =new mongoose.Types.ObjectId(id);
                const pdfUrl = `http://localhost:4000/${file.path}`;
                const folderName = req.body.folderName;
                const likeStatus = 'unlike';
                const DeleteStatus = 'not in bin';
                const uploadDate = new Date();

                console.log({
                    userId,
                    pdfUrl,
                    folderName,
                    likeStatus,
                    DeleteStatus,
                    uploadDate,
                });

                const pdf = new Pdf({
                    userId,
                    pdfUrl,
                    folderName,
                    likeStatus,
                    uploadDate,
                });

                console.log("Pdf to be saved:", pdf);

                const savedpdf = await pdf.save();
                console.log("Saved pdf:", savedpdf);
                savedpdfs.push(savedpdf);
            } catch (innerError) {
                console.error(`Error processing file ${file.originalname}:`, innerError);
                return res.status(500).json({ message: `Error processing file ${file.originalname}`, error: innerError });
            }
        }

        console.log("All files processed successfully");
        res.json({ message: 'pfds uploaded successfully', pdfs: savedpdfs });
    } catch (error) {
        console.error("Error uploading pdfs:", error);
        res.status(500).json({ message: 'Error uploading pdfs', error });
    }
};



exports.getPdfDetails = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    try { 
        const ispdfDetails = await Pdf.find({ userId:new mongoose.Types.ObjectId(id) });

        if (ispdfDetails.length === 0 ) {
            return res.json({
                message: "This user has not uploaded any pfds. Please upload the pfds.",
                success: false
            });
        }
        
        return res.json({
            message: "pdf details retrieved successfully.",
            success: true,
            pdfs: ispdfDetails 
        });
    } catch (error) {
        console.error("Error getting pdfs and details:", error);
        res.status(500).json({ message: 'Error getting pdfs and details', error });
    }
};

exports.getFolders = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    try { 
        const uniqueFolderNames = await Pdf.aggregate([
            { $match: { userId:new mongoose.Types.ObjectId(id) } }, 
            { $group: { _id: "$folderName" } }, 
            { $project: { _id: 0, folderName: "$_id" } } 
        ]);

        res.json({
            message: "Unique folder names retrieved successfully.",
            success: true,
            uniqueFolderNames
        });
    } catch (error) {
        console.error("Error getting pdfs and details:", error);
        res.status(500).json({ message: 'Error getting pdfs and details', error });
    }
};

exports.getByFolder = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);
    const folderName = req.params.folderName;

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    try { 
        const FolderByDetail = await Pdf.find({ userId:new mongoose.Types.ObjectId(id), folderName });
        if(!FolderByDetail){
            return res.json({
                message : "not Details"
            })
        }
        console.log("FolderByDetail : ",FolderByDetail);
        res.json({
            message: "Folder details get successfully.",
            success: true,
            FolderByDetail
        });
    } catch (error) {
        console.error("Error getting folder details:", error);
        res.status(500).json({ message: 'Error getting folder details', error });
    }
};

exports.changeDeleteStatus = async(req ,res ) => {
    const pfdID = req.params.pfdID;
    console.log("pfdID:", pfdID);

    try {
        if (!mongoose.Types.ObjectId.isValid(pfdID)) {
            return res.status(400).json({
                message: "Invalid pfd ID.",
                success: false
            });
        }
        const update = await Pdf.findOneAndUpdate(
            { _id: pfdID },
            { $set: { DeleteStatus: 'bin' } },
            { new: true } 
        );

            if (!update) {
                return res.status(404).json({
                    message: "pfd not found.",
                    success: false
                });
            }
    
            return res.json({
                message: "Status updated successfully.",
                success: true,
                update
            });
        
    } catch (error) {
        console.error("Error Updating Delete status:", error);
        res.status(500).json({ message: 'Error Updating Delete status', error });
    }

}

exports.changeLikeStatus = async(req ,res ) => {
    const pfdID = req.params.pfdID;
    console.log("pfdID:", pfdID);

    try {
        if (!mongoose.Types.ObjectId.isValid(pfdID)) {
            return res.status(400).json({
                message: "Invalid pfd ID.",
                success: false
            });
        }
        const update = await Pdf.findOneAndUpdate(
            { _id: pfdID },
            { $set: { likeStatus: 'like' } },
            { new: true } 
        );

            if (!update) {
                return res.status(404).json({
                    message: "pfd not found.",
                    success: false
                });
            }
    
            return res.json({
                message: "Status updated successfully.",
                success: true,
                update
            });
        
    } catch (error) {
        console.error("Error Updating Like status:", error);
        res.status(500).json({ message: 'Error Updating Like status', error });
    }

}

exports.deletePdfDetails = async (req, res) => {
    const pfdID = req.params.pfdID;
    console.log("pfdID:", pfdID);

    try {
        if (!mongoose.Types.ObjectId.isValid(pfdID)) {
            return res.status(400).json({
                message: "Invalid pfd ID.",
                success: false
            });
        }

const pdf = await Pdf.findOneAndDelete({_id : pfdID});
        console.log("pdf:", pdf);

        if (!pdf) {
            return res.status(404).json({
                message: "pfd not found.",
                success: false
            });
        }

        return res.json({
            message: "pfd deleted successfully.",
            success: true,
            pdf
        });
    } catch (error) {
        console.error("Error deleting pdfs and details:", error);
        res.status(500).json({ message: 'Error deleting pdfs and details', error });
    }
};