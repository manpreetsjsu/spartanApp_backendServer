const express= require('express');
const router=express.Router();
const Course= require('../../models/courses');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Sent you the courses"
    });
});

router.post('/',(req,res,next)=>{
    //getting data for creating a post. This is what the API expects to get from the front end.
    const course= new Course({
        _id:mongoose.Types.ObjectId(),
        courseTitle:req.body.courseTitle,
        courseDescription:req.body.courseTitle,
    });
    course
});

router.get('/:courseId',(req,res,next)=>{
    const id=req.params.courseId;
    res.status(200).json({
        message:"Sent you the course with the given id",
        id:id
    });
});


router.patch('/:courseId',(req,res,next)=>{
    const id=req.params.courseId;
    res.status(200).json({
        message:"The Course has been edited",
        id:id
    });
});

router.delete('/:courseId',(req,res,next)=>{
    const id=req.params.courseId;
    res.status(200).json({
        message:"The course has been deleted",
        id:id
    });
});

module.exports=router;