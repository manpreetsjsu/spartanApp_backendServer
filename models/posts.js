const mongoose = require('mongoose');

const postSchema =mongoose.Schema({
   //_id is a conventionn
    //_id is of type mongoose
    _id: mongoose.Schema.Types.ObjectId,
    title:String,
    body:String

});

//the schema is the layout/design and model is the object itself , it gives us a constructor
//to build objects based on this schema

//We wrap the export in a schema with this function, first argument is the name of the model and second is the
//schema you want to use
module.exports=mongoose.model('Post',postSchema);