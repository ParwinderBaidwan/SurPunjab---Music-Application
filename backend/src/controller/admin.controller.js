import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function to upload file to cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            // folder : 'music-app',
            resource_type : 'auto'
        }); // upload the file to cloudinary

        return result.secure_url;   // return the url of the uploaded file
    } catch (error) {
        console.log("Error in uploadToCloudinary : ", error);
        throw new Error("Something went wrong while uploading file");
    }
}

export const createSong = async (req , res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message : "Please upload both audio and image file"});
        }

        const { title , artist , albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        // calling function to store files
        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId : albumId || null,
        })

        await song.save();

        // if song belong to album then update the album's song array
        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push : { songs : song._id }
            });
        }
        // if(albumId){
        //     const album = await Album.findById(albumId);
        //     album.songs.push(song._id);
        //     await album.save();
        // }

        res.status(201).json(song);

    } catch (error) {
        console.log("Error in createSong : ", error);
        next(error);
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        // if(!song){
        //     return res.status(404).json({message : "Song not found"});
        // }

        // if song belong to album then update the album's song array
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull : { songs : song._id }
            });
        }

        // await song.remove();
        await Song.findByIdAndDelete(id);

        res.status(200).json({message : "Song deleted successfully"});
    } 
    catch (error) {
        console.log("Error in deleteSong : ", error);
        next(error);
    }
};

export const createAlbum = async (req , res, next) => {
    try {
        // if(!req.files || !req.files.imageFile){
        //     return res.status(400).json({message : "Please upload image file"});
        // }

        const { title , artist , releaseYear } = req.body;
        const {imageFile} = req.files;

        const imageUrl = await uploadToCloudinary(imageFile)

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })

        await album.save();
        
        res.status(201).json(album);
    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId : id });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message : "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
};

