const express = require('express');
const app=express();
const morgan=require('morgan');
const postsRoutes= require('./api/routes/posts');
const coursesRoutes=require('./api/routes/courses');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');

//The process.env is where the password for mongoose is coming from. It lives in a file called nodemon.json
mongoose.connect(
    'mongodb://arshbhatti8:'+
    process.env.MONGO_ATLAS_PW +
    '@cluster0-shard-00-00-ovbfq.mongodb.net:27017,cluster0-shard-00-01-ovbfq.mongodb.net:27017,cluster0-shard-00-02-ovbfq.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

//to log incoming requests
app.use(morgan('dev'));
//for parsing body of the incoming requests, it supports URL encoded bodies and JSON data. Extended means complex supporting complex bodies of URL
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//the following is to allow Cross-Origin Resource Sharing
//the second argument is to limit it to the web address that can use the API
//you can write something like 'http://www.arshbhatti.com' can have access
//this will just modify the responses that you send to include this information to resolve CORS issue
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    //all these types of headers will be appended
    res.header('Access-Control-Allow-Headers','Origin,X-Requtested-With,Content-Type,Accept,Authorization');
    //browser sends options when you send POST or PUT request,browser does it to check if its allowed to send that request
    //this tells the browser what you support
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();//to forward all the requests
});



//making a middleware-telling the app that if we get anything /jobs, it should be handles with the
//mentioned handler in the second argument. The first argument is like a filter.
app.use('/posts',postsRoutes);
app.use('/courses',coursesRoutes);
    
app.use((req,res,next)=>{
    //Error is a constant provided by Node
    const error = new Error('Not found');
    error.status=404;
    //next forwards the request
    next(error);
});

//this handles errors when some operations fail like anything on the DB side fails
app.use((error,req,res,next) => {
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });

});
module.exports=app;