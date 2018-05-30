const express=require('express');
const router=express.Router();
//the object USER from the model
const User =require('../../models/users');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/signup',(req,res,next) =>{
    //salt is second argument which means adding random strings to the password
     bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err,
                message:"Error in hashing password"
            })
        }
        else{
            const user=new User({
                _id: new mongoose.Types.ObjectId(),
                name:req.body.name,
                dob:req.body.dob,
                email:req.body.email,
                password:hash,
                enrolledCourses:[]

            });
            user.save()
                .then(result=>{
                    console.log(result);
                    res.status(201).json({
                        message:'User created'
                    });
                })
                .catch(err=>{
                     console.log(err);
                     res.status(500).json({
                         error:err,
                         message:"Error in storing to database"
                     });
                })
        }
    })

});

//Login Process
router.post('/login',(req,res,next) =>{
    console.log(req.body);
    console.log(req.body.email);
    User.findOne({ email: req.body.email})
        .exec()
        .then(user=>{
            if(user===null){
                res.status(401).json({
                    message:"Auth Failed"
                });
            }
            // if(user.length<1){
            //     return res.status(401).json({
            //         message:'Auth Failed'
            //     });
            //
            // }

            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message:"Auth Failed"
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email:user,
                        userId:user._id
                    },
                        process.env.JWT_KEY,
                        {expiresIn:"1h"}
                        );
                    return res.status(200).json({
                        message:'Auth Successful',
                        token: token,
                        data:{user}
                    });
                }
                res.status(401).json({
                    message:"Auth Failed"
                });
            });
        });

});


router.get('/',(req,res,next)=>{
    User
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

router.get('/:id',(req,res,next)=>{
    User
        .findOne({_id:req.params.id})
        .exec()
        .then(docs=>{
            console.log("this is get request for individual user"+docs);
            res.status(200).json(docs);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
});


router.patch('/:id',(req,res,next)=>{
    const id=req.params.id;
    console.log(req.body);
    console.log(req.body.enrolledCourses);
    User.update({_id:id},{$set:{enrolledCourses:req.body.enrolledCourses}})
        .exec()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                message:"Course enrolled  successfully",
                result:result
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
             });
        });

});

router.delete('/',(req,res,next)=>{
    const id=req.params.id;
    User.remove()
        .exec()
        .then(result=>{
            res.status(200).json({result});
            console.log("user deleted");
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        });

});



module.exports=router;