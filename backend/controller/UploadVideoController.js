const video = require("../model/VideoModel");


const videocreate = async (req, res) => {
  try {
    const {
      category,
      Title
    } = req.body;

   const {name,profilepic,id}=req.user
    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: "Image upload failed!" });
    }
const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
 
    // Create and save the new path
    const newPath = new video({
        Name:name,
        userid:id,
  category,
  profilepic,
    date:formattedDate,
  Title,
  comments:[],
  isliked:[],
  videourl:req.file.path,
    });

    await newPath.save();
    res.status(201).json({
      message: "Video Upload successfully",
    });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getvideo = async (req, res) => {
  try {
    const { category, page , limit} = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is missing!" });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let videos, totalVideos;

    if (category === "All") {
      totalVideos = await video.countDocuments();
      videos = await video.find().sort({createdAt:-1}).skip(skip).limit(limitNumber);
    } else {
      totalVideos = await video.countDocuments({ category });
      videos = await video.find({ category }).sort({createdAt:-1}).skip(skip).limit(limitNumber);
    }
    return res.status(200).json({
      videos,
      totalPages: Math.ceil(totalVideos / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deletevideo = async (req, res) => {
  const { videoid } = req.query;

  try {
    const deletedVideo = await video.findByIdAndDelete(videoid);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {videocreate,getvideo,deletevideo};
