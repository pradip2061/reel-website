const Sign = require("../model/SignUpModel")
const video = require("../model/VideoModel")

const liked = async (req, res) => {
  try {
    const { videoid } = req.body;
    const { id } = req.user;

    if (!id) return res.status(404).json({ message: "User ID not found" });
    if (!videoid) return res.status(400).json({ message: "Video ID is required" });

    const videoInfo = await video.findById(videoid);
    if (!videoInfo) return res.status(404).json({ message: "Video not found" });

    const userInfo = await Sign.findById(id);
    if (!userInfo) return res.status(404).json({ message: "User not found" });

    const index = videoInfo?.isliked?.indexOf(id);
    const userIndex = userInfo?.likedvideos?.indexOf(videoid);

    let liked;

    if (index !== -1 && userIndex !== -1) {
      // Already liked → remove like
      videoInfo.isliked.splice(index, 1);
      userInfo.likedvideos.splice(userIndex, 1);
      liked = false;
    } else {
      // Not liked yet → add like
      videoInfo.isliked.push(id);
      userInfo.likedvideos.push(videoid);
      liked = true;
    }

    await videoInfo.save();
    await userInfo.save(); // Don't forget to save user info too

    res.status(200).json({ liked,likevideos:userInfo.likedvideos});
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const comment = async (req, res) => {
  try {
    const { id,name } = req.user; // Authenticated user ID
    const { videoId, message } = req.body;
console.log(videoId,message)
    if (!videoId || !message) {
      return res.status(400).json({ message: "Video ID and message are required" });
    }

    // Fetch user info
    const userinfo = await Sign.findById(id).select('profilepic');
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch video info
    const videoinfo = await video.findById(videoId);
    if (!videoinfo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Add new comment
    videoinfo.comments.push({
      userid: id,
      message,
      profilepic: userinfo.profilepic,
      reply: [],
      Name:name
    });

    await videoinfo.save();

    res.status(200).json({ message: "Comment successfully added" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const replyToComment = async (req, res) => {
  try {
    const { id, name } = req.user; // Authenticated user ID
    const { videoid, commentid, message } = req.body;

    if (!videoid || !commentid || !message) {
      return res.status(400).json({ message: "videoid, commentId, and message are required" });
    }

    const userinfo = await Sign.findById(id).select("profilepic");
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    const videoinfo = await video.findById(videoid);
    if (!videoinfo) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = videoinfo.comments.id(commentid);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Optional: Prevent duplicate replies from the same user within 5 seconds (anti double-click)
    const now = new Date();
    const recentReply = comment.reply.find(
      r => r.userid.toString() === id && now - new Date(r.createdAt) < 5000
    );
    if (recentReply) {
      return res.status(429).json({ message: "Please wait before replying again" });
    }

    comment.reply.push({
      userid: id,
      message,
      profilepic: userinfo.profilepic,
      username: name,
      createdAt: new Date(),
    });

    await videoinfo.save();

    res.status(200).json({ message: "Reply added successfully" });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const checkLikeOrNot = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const likedvideos= await Sign.findById(id).select('likedvideos');
    if (!likedvideos) {
      return res.status(404).json({ message: "Video not found" });
    }


    return res.status(200).json({ likedvideos,id });
  } catch (error) {
    console.error("Error checking like status:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getComments = async (req, res) => {
  try {
    const { videoid } = req.query;

    if (!videoid) {
      return res.status(400).json({ message: "videoid is required" });
    }

    const videoInfo = await video.findById(videoid).select("comments");

    if (!videoInfo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Optional: reverse to show latest comments first
    const comments = [...videoInfo.comments].reverse();
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteCommentOrReply = async (req, res) => {
  try {
    const { videoId, commentId, replyId } = req.body;

    if (!videoId || !commentId) {
      return res.status(400).json({ message: "videoId and commentId are required" });
    }

    console.log(replyId)
    // Find the video
    const videoinfo = await video.findById(videoId);
    if (!videoinfo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if it's a reply deletion
    if (replyId) {
      const comment = videoinfo.comments.find(c => c._id.toString() === commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const initialLength = comment.reply.length;

      // Filter out the reply by ID
      comment.reply = comment.reply.filter(r => r._id.toString() !== replyId);

      if (comment.reply.length === initialLength) {
        return res.status(404).json({ message: "Reply not found" });
      }

    } else {
      // Delete entire comment
      const initialLength = videoinfo.comments.length;

      // Filter out the comment by ID
      videoinfo.comments = videoinfo.comments.filter(c => c._id.toString() !== commentId);

      if (videoinfo.comments.length === initialLength) {
        return res.status(404).json({ message: "Comment not found" });
      }
    }

    await videoinfo.save();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete comment/reply error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getsinglevideo=async (req, res) => {
  const videoId = req.params.id;

  try {
    const Video = await video.findById(videoId);
    if (!Video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Return the video document as JSON
    res.json({ Video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const getpersonalinfo = async (req, res) => {
  try {
    const { id, name } = req.user;

    // Get user info, exclude password
    const userinfo = await Sign.findById(id).select("-password");

    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get videos uploaded by this user
    const videos = await video.find({userid:id}).select("videourl comments isliked category createdAt");

    return res.status(200).json({ userinfo, videos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getotherpersonalinfo = async (req, res) => {
  try {
    const { id} = req.query;

    // Get user info, exclude password
    const userinfo = await Sign.findById(id).select("-password");

    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get videos uploaded by this user
    const videos = await video.find({userid:id}).select("videourl comments isliked category createdAt");

    return res.status(200).json({ userinfo, videos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handlefollowerAndfollowing = async (req, res) => {
  try {
    const { userid } = req.body;
    const { id } = req.user;
    if (userid === id) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const otheruserinfo = await Sign.findById(userid);
    const ownuserinfo = await Sign.findById(id);

    if (!otheruserinfo || !ownuserinfo) {
      return res.status(404).json({ message: "User not found." });
    }

    const isFollowing = otheruserinfo.followers.includes(id);

    if (isFollowing) {
      // 🔁 Unfollow logic
      otheruserinfo.followers = otheruserinfo.followers.filter(followerId => followerId !== id);
      ownuserinfo.following = ownuserinfo.following.filter(followingId => followingId !== userid);
    } else {
      // ✅ Follow logic
      otheruserinfo.followers.push(id);
      ownuserinfo.following.push(userid);
    }

    await otheruserinfo.save();
    await ownuserinfo.save();

    res.status(200).json({ 
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully" 
    });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports= {liked,comment,replyToComment,getComments,checkLikeOrNot,deleteCommentOrReply,getsinglevideo,getpersonalinfo,getotherpersonalinfo,handlefollowerAndfollowing}