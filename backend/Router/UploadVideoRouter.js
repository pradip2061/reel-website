const express =require('express')
const {upload } = require('../middleware/upload')
const{videocreate, getvideo, deletevideo}= require('../controller/UploadVideoController')
const checkCookieAuth = require('../middleware/AuthCheck')
const uploadvideoRouter = express.Router()

uploadvideoRouter.post('/uploadvideo',checkCookieAuth,upload.single('videourl'),videocreate)
uploadvideoRouter.get('/getvideo',getvideo)
uploadvideoRouter.get('/deletevideo',deletevideo)

module.exports = uploadvideoRouter