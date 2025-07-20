
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Sign = require('../model/SignUpModel')
const login = async(req,res)=>{
try {
    const{formData}=req.body
        const{email,password}= formData
    if(!email || !password){
        return res.status(400).json({message:'fill the form properly!'})
    }

    const userinfo = await Sign.findOne({email:email})
    console.log(userinfo)
    if(!userinfo){
        return res.status(404).json({message:'user not found'})
    }
    const checkpassword = bcrypt.compareSync(password,userinfo.password)
    console.log(checkpassword)
    if(!checkpassword){
        return  res.status(400).json({message:'password is wrong!'})
    }

    const token = jwt.sign({id:userinfo._id},process.env.JWT_SECRET,{expiresIn:'7d'})
    console.log(token)
    res.cookie('token', token, {
  httpOnly: true,
    secure: false, // true in production
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
});   

    res.status(200).json({message:'login successfully!',id:userinfo._id})
} catch (error) {
    console.log(error)
}
}
const logout =async(req,res)=>{
    try {
        res.clearCookie('token', {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
  res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        
    }
}

module.exports = {login,logout}