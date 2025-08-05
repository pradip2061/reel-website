import React, { useEffect, useState } from "react";
import { Send, Reply, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { commentThunk } from "../../store/comment/commentThunk";
import { RefreshComment, setComment } from "../../store/comment/commentSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ onClose, videoId }) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [reply, setReply] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const userid = useSelector((state) => state.login.userid);
  const isLogin = localStorage.getItem("isLogin") === "true";
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { comments, error, status } = useSelector((state) => state.comment);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      toast.info("Please log in to post a comment.");
      return;
    }
    if (!newComment.trim()) return;

    await dispatch(commentThunk({ videoId, message: newComment }));
    await getComments();
    setNewComment("");
  };

  const getComments = async () => {
    try {
      if (!isLogin) {
        return;
      }
      setLoadingComment(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/getcomment?videoid=${videoId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(setComment(res.data.comments));
      }
    } catch (err) {
      console.error("Fetch comments error:", err?.response?.data?.message || err);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleReply = async (commentId) => {
    const message = reply[commentId]?.trim();
    if (!message) return;
    setReplyLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/replycomment`,
        { commentid: commentId, videoid: videoId, message },
        { withCredentials: true }
      );
      if (res.status === 200) {
        await getComments();
        setReplyingTo(null);
        setReply((prev) => ({ ...prev, [commentId]: "" }));
      }
    } catch (err) {
      console.error("Reply error:", err?.response?.data?.message || err);
    } finally {
      setReplyLoading(false);
    }
  };

  const deleteReplyOrComment = async (commentId, replyId = null) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/deletereplyorcomment`,
        { commentId, videoId, replyId },
        { withCredentials: true }
      );
      if (res.status === 200) {
        await getComments();
      }
    } catch (err) {
      console.error("Delete error:", err?.response?.data?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(RefreshComment());
    getComments();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const CommentItem = ({ comment }) => {
    const isExpanded = expandedReplies[comment._id] || false;
    const replyCount = comment.reply?.length || 0;

    const handleprofile = () => {
      if (userid === comment.userid) {
        navigate("/userprofile");
      } else {
        navigate(`/visitprofile/${comment?.userid}`);
      }
    };

    const handlereplyprofile = (id) => {
      if (userid === id) {
        navigate("/userprofile");
      } else {
        navigate(`/visitprofile/${id}`);
      }
    };

    return (
      <div className="mb-5 flex space-x-3 items-start text-black">
        <img
          src={comment.profilepic}
          alt="user profile"
          className="rounded-full w-10 h-10 flex-shrink-0"
          onClick={handleprofile}
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-base font-semibold">{comment.Name}</h4>
              <span className="text-xs text-gray-500">{comment.timestamp}</span>
            </div>
            <p className="text-sm">{comment.message}</p>
            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment._id ? null : comment._id)
                }
                className="flex items-center space-x-1 hover:text-red-500"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>

              {replyCount > 0 && (
                <button
                  onClick={() =>
                    setExpandedReplies((prev) => ({
                      ...prev,
                      [comment._id]: !prev[comment._id],
                    }))
                  }
                  className="text-blue-600 hover:underline"
                >
                  {isExpanded ? "Hide Replies" : `Show Replies (${replyCount})`}
                </button>
              )}
            </div>

            {comment.userid === userid && (
              <button
                className={` ${loading ? "text-red-300" : "text-red-500"} mt-2 text-sm `}
                onClick={() => deleteReplyOrComment(comment._id)}
                disabled={loading}
              >
                Delete
              </button>
            )}
          </div>

          {isExpanded &&
            comment.reply?.map((item) => (
              <div key={item._id} className="flex items-start ml-12 mt-3 space-x-3">
                <img
                  src={item.profilepic}
                  alt="reply profile"
                  className="w-8 h-8 rounded-full"
                  onClick={() => handlereplyprofile(item.userid)}
                />
                <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <h4 className="text-sm font-semibold">{item.username}</h4>
                  <p className="text-sm text-gray-700 mt-1">{item.message}</p>
                  {item.userid === userid && (
                    <button
                      className={` ${loading ? "text-red-300" : "text-red-500"} mt-2 text-sm `}
                      onClick={() => deleteReplyOrComment(comment._id, item._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

          {replyingTo === comment._id && (
            <div className="mt-3 ml-10">
              <input
                type="text"
                placeholder="Write a reply..."
                className="w-full p-2 rounded-lg border text-black"
                value={reply[comment._id] || ""}
                onChange={(e) =>
                  setReply((prev) => ({ ...prev, [comment._id]: e.target.value }))
                }
                autoFocus
              />
              <div className="flex justify-end mt-1 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReply((prev) => ({ ...prev, [comment._id]: "" }));
                  }}
                  className="px-3 py-1 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReply(comment._id)}
                  className={`px-3 py-1 ${replyLoading ? "bg-red-300" : "bg-red-600"}  text-white rounded-lg`}
                  disabled={replyLoading}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="h-[30%] w-full bg-black bg-opacity-30" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-white rounded-t-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 text-black">
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
          <button onClick={onClose} className="hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        {!isLogin ? (
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={() => navigate("/loginsignup", { replace: true })}
              className="bg-white text-red-600 border border-red-500 font-semibold px-5 py-2 rounded hover:bg-red-100 transition"
            >
              Sign In your account
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {loadingComment ? (
                <div className="flex justify-center items-center mt-10">
                  <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading comments...</span>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))
              ) : (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            {/* New Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center space-x-3 p-3 border-t border-gray-200 bg-white"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
                className="flex-1 resize-none rounded-full px-4 py-2 text-black border text-base"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || status === "pending"}
                className="bg-red-600 px-4 py-2 rounded-full text-white disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
