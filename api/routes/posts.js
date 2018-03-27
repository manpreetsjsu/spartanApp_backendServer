const express=require('express');
const router=express.Router();

//the object POST from the model
const Post =require('../../models/posts');
const mongoose=require('mongoose');
//first argument is URL for router
//only giving it / because if you put in /jobs
//you will get /jobs/jobs because you're assigning a handler in app.js for this route
router.get('/',(req,res,next)=>{
    Post
        .find()
        .exec()
        .then(docs=>{
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                erorr:err
            })
        })
});

router.post('/',(req,res,next)=>{
    //getting data for creating a post. This is what the API expects to get from the front end.
    //creating a new mongoose object that creates an entry into the DB
    const post= new Post({
        _id: new mongoose.Types.ObjectId(),
        title:req.body.title,
        postbody:req.body.postbody
    });
    //save is a method provided by mongoose to be used on mongoose objects,it stores everything in the DB
    //.then is a promise

    post.save()
        .then(result=>{
        console.log("This the post result from the DB",result);
        res.status(201).json({
            message:"Handling POST request to /posts",
            createdPost:result
        });
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

//for getting a particular post.You are expecting to get the ID of the post encoded
//into the URL, so ':' is how you address a variable segment
router.get('/:postId',(req,res,next)=>{
    const id= req.params.postId;
    Post.findById(id)
        .exec()
        .then(doc=>{
            console.log("This is from the database",doc);
            if(doc){
            res.status(200).json({doc});
            } else{
                res.status(404).json({
                    message:"No valid entry found for provided id "
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });
});

router.patch('/:postId',(req,res,next)=>{
    res.status(200).json({
        message:"Post has been modified"
    });
});

router.delete('/:postId',(req,res,next)=>{
    const id=req.params.postId;
   Post.remove({_id: id})
       .exec()
       .then(result=>{
           res.status(200).json({result});
       })
       .catch(err=>{
           console.log(err);
           res.status(500).json(
               {error:err})
       });

});


module.exports=router;