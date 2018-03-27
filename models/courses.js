const mongoose =require('mongoose');

const courseSchema= mongoose.Schema({
   _id:mongoose.Schema.Types.ObjectId,
    courseTitle:String,
    coursedescription:String
});

module.exports=mongoose.model('Course',courseSchema);