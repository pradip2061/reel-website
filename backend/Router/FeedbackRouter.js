const express =require('express')
const { liked, comment, checkLikeOrNot, getComments, replyToComment, deleteCommentOrReply, getsinglevideo, getpersonalinfo } = require('../controller/FeedbackController')
const checkCookieAuth = require('../middleware/AuthCheck')

const feedbackRouter = express.Router()
feedbackRouter.post('/like',checkCookieAuth,liked)
feedbackRouter.post('/comment',checkCookieAuth,comment)
feedbackRouter.post('/replycomment',checkCookieAuth,replyToComment)
feedbackRouter.post('/deletereplyorcomment',checkCookieAuth,deleteCommentOrReply)
feedbackRouter.get('/islike',checkCookieAuth,checkLikeOrNot)
feedbackRouter.get('/getcomment',getComments)
feedbackRouter.get('/getsinglevideo/:id',getsinglevideo)
feedbackRouter.get('/getpersonaldetail',checkCookieAuth,getpersonalinfo)
module.exports = feedbackRouter