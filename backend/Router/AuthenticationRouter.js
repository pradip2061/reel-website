const express =require('express')
const signup = require('../controller/SignUpController')
const { login, logout } = require('../controller/LoginController')
const {profileupload } = require('../middleware/upload')

const AuthenticationRouter = express.Router()

AuthenticationRouter.post('/signup',profileupload.single('profilepic'),signup)
AuthenticationRouter.post('/login',login)
AuthenticationRouter.get('/logout',logout)
module.exports = AuthenticationRouter