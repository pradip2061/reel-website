const express =require('express')
const signup = require('../controller/SignUpController')
const { login, logout } = require('../controller/LoginController')
const {profileupload } = require('../middleware/upload')
const verifyToken = require('../middleware/CheckTokenExpirey')

const AuthenticationRouter = express.Router()

AuthenticationRouter.post('/signup',profileupload.single('profilepic'),signup)
AuthenticationRouter.post('/login',login)
AuthenticationRouter.get('/logout',logout)
AuthenticationRouter.get('/verifytoken',verifyToken)
module.exports = AuthenticationRouter