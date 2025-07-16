const video = require("../model/VideoModel");


const videocreate = async (req, res) => {
  try {
    const {
      category,
      Title
    } = req.body;

   const {name,profilepic}=req.user
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
  category,
  profilepic,
    date:formattedDate,
  Title,
  comments:[],
  isliked:[],
  videourl:req.file.path
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
    const { category } = req.query;
    console.log(category)
    if (!category) {
      return res.status(400).json({ message: "Category is missing!" });
    }

    let videos;

    if (category === "All") {
      videos = await video.find();
    } else {
      videos = await video.find({ category });
    }

    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {videocreate,getvideo};
