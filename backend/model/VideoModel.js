const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Name: {
    type: String,
  },
  userid:{
    type:String
  },
  category: {
    type: String,
  },
    date:{
    type:String
  },
  Title:{
    type:String
  },
  videourl:{
    type:String
  },
   profilepic:{
            type:String
        },
  comments:[
    {
      userid: {
        type: String,
      },
      profilepic:{
            type:String
        },
      message:{
        type:String
      },
      Name:{
        type:String
      },
      reply:[{
        userid:{
            type:String
        },
        username:{
            type:String
        },
        profilepic:{
            type:String
        },
        message:{
          type:String
        },
         createdAt: {
    type: Date,
  },
      }]
    },
  ],
  isliked:[String],
},{timestamps:true});

const  video = mongoose.model("video", schema);

module.exports = video;
