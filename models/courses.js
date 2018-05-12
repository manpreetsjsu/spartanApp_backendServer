const mongoose =require('mongoose');

const courseSchema= mongoose.Schema({
   _id:mongoose.Schema.Types.ObjectId,
    name:String,
    instructor:String,
    tutor:String,

});

module.exports=mongoose.model('Subject',courseSchema);