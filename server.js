const http=require('http');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Todo=require('./models/todo');
const headers=require('./baseHeader');
const {v4:uuidv4} =require('uuid');

dotenv.config({path:'./config.env'});

const DBConnect=process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DBConnect)
.then(()=>{
    console.log('資料庫連線成功');
})
.catch((error)=>{
    console.log('資料庫連線失敗')
});

const requestListener=async(req,res)=>{
    let body='';
    req.on('data',chunk=>{
        body+=chunk;
    });
    if(req.url=='/posts'){
        switch (req.method) {
            case 'GET':
            const todos=await Todo.find({});
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                'status':'success',
                'data':todos
            }))
            res.end();
                
                break;
            case 'POST':
            req.on('end',async()=>{
                try{
                const title=JSON.parse(body).title;
                const todos=await Todo.create({
                    title,
                    id:uuidv4()
                });
                res.writeHead(200,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'data':todos
                }))
                res.end();
                }catch{
                    res.writeHead(400,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'message':'欄位未填寫正確，無此todo id'
                }))
                res.end();
                }
            })
                break;
            case 'DELETE':
                const deltodos=await Todo.deleteMany({});
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                'status':'success',
                'data':deltodos
            }))
            res.end();
                break;

            default:
                break;
        }

    }else if(req.url.startsWith('/posts/')){
        const id =req.url.split('/').pop();
        switch(req.method){
             case 'DELETE':
            await Todo.findByIdAndDelete(id)
            .then(()=>{
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                'status':'success',
                'emssage':'資料刪除成功'
            }))
            res.end();
                        })
            .catch((error)=>{
                   res.writeHead(400,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'message':'刪除失敗，無此todo id'
                }))
                res.end();
            })                        
                break;
                 case 'PATCH':
                req.on('end',async()=>{
                try{
                const title=JSON.parse(body).title;
                await Todo.findByIdAndUpdate(id,{title})
            .then(()=>{
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                'status':'success',
                'emssage':'資料修改成功'
            }))
            res.end();
                        })
            .catch((error)=>{
                   res.writeHead(400,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'message':'修改失敗，無此todo id'
                }))
                res.end();
            })                        
                }catch{
                    res.writeHead(400,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'message':'欄位未填寫正確，無此todo id'
                }))
                res.end();
                }
            })
                break;
        }
    }
    else {
           res.writeHead(404,headers);
                res.write(JSON.stringify({
                    'status':'success',
                    'message':'無此網站路由'
                }))
                res.end();
    }
    


};

const server=http.createServer(requestListener);
server.listen(process.env.PORT);