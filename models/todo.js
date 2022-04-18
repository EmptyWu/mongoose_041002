const mongoose=require('mongoose');

const todoSchema=new mongoose.Schema({
    title:{type:String,required:[true,'title必填']},
    id:{type:String,required:true}
},{
    versionKey:false,
    timeseries:true
});

const Todo=mongoose.model('Todo',todoSchema);
module.exports=Todo;