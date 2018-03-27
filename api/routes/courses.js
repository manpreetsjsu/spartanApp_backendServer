const express= require('express');
const router=express.Router();
const Course= require('../../models/courses');
const mongoose = require('mongoose');

router.get('/',(req,res,next)=>{
   Course
       .find()
       .exec()
       .then(docs=>{
           console.log(docs);
           res.status(200).json(docs);
       })
       .catch(err=>{
           console.log(err);
           res.status(500).json({
               error:err
           })
       })
});

router.post('/',(req,res,next)=>{
    //getting data for creating a post. This is what the API expects to get from the front end.
    const course= new Course({
        _id: new mongoose.Types.ObjectId(),
        courseTitle:req.body.courseTitle,
        courseDescription:req.body.courseDescription
    });
    course
        .save()
        .then(result=>{
            console.log("This data is from DB",result);
            res.status(201).json({
                message:"handling POST request to /courses",
                createdPost:result
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
});

router.get('/:courseId',(req,res,next)=>{
    const id=req.params.courseId;
    Course.findById(id)
        .exec()
        .then(doc=>{
            console.log("This is from the database",doc);
            if(doc) {
                res.status(200).json({doc})
            } else{
                res.status(404).json({
                    message:"No valid entry found for provided id"
                });
            }
        })
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
    Course.remove({_id:id})
        .exec()
        .then(result=>{
            res.status(200).json({result});
        })
        .catch(err=>{
           res.status(500).json({
               error:err
           })
        });

});

module.exports=router;