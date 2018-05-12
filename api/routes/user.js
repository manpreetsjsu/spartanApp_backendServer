const express=require('express');
const router=express.Router();
//the object USER from the model
const User =require('../../models/users');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');


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
    User.findOne({ email: req.body.email})
        .exec()
        .then(user=>{
            if(user===null){
                res.status(401).json({
                    message:"Auth Failed"
                });
            }
            if(user.length<1){
                return res.status(401).json({
                    message:'Authorization Failed'
                });

            }

            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message:"Auth Failed"
                    });
                }
                if(result){
                    return res.status(200).json({
                        message:'Auth Successful'
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


module.exports=router;