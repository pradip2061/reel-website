const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
Name:{
    type:String
},
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  profilepic:{
    type:String
  },
  likedvideos:[String],
  followers:[String],
  following:[String]
}, { timestamps: true });

const Sign = mongoose.model('Sign', schema);

module.exports = Sign;
