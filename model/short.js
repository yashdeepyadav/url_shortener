const mongoose = require('mongoose')

const urlSchema= new mongoose.Schema({
  full:{
    type:String,
    required:true
  },
  short:{
    type:String,
    required:true,
    default:"eed"
  },
  clicks:{
    type:Number,
    required:true,
    default:0
  },
  counter:{
    type:Number,
    required:true,
  }
},{
timestamps:true})

module.exports = mongoose.model('UrlData',urlSchema)