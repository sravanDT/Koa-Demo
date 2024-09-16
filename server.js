const Koa = require('koa');
const app = new Koa();
const Router = require("koa-router")
const router = new Router();
const bodyParser = require("koa-bodyparser");
const Todos = require("./models/todos")
const dotenv = require("dotenv").config()
const connectDB = require('./config/db'); 
connectDB(); 

const PORT = process.env.PORT || 5000

app.use(bodyParser())


//Get all todos
//@method GET
//@route /todos

router.get("/todos", async(ctx,next)=>{
    try{
        const todos = await Todos.find();
        ctx.body = todos
    }
    catch(err){
        ctx.status = 500;
        ctx.body={messsge:"Not Found",  error:err}
    }
})





//Get Todo by id
//@method GET
//@route /todos/:id

router.get("/todos/:id", async(ctx,next)=>{
    try{
        const todo = await Todos.findById(ctx.params.id);
        if(todo){
            ctx.body = todo
        }
        else{
            ctx.status = 404;
            ctx.body = {messsge:"Not Found"}
        }
    }
    catch(err){
        ctx.status = 500;
        ctx.body={messsge:"Error Fetching todo",  error:err}
    }
})



//POST Todo
//@method POST
//@route /todos
router.post("/todos", async(ctx,next)=>{
    try{
        const {title,completed}= ctx.request.body
        const newTodo = new Todos({
            title,completed
        })
        const savedTodo = await newTodo.save();
        ctx.status = 201
        ctx.body = savedTodo
    }
    catch(err){
        ctx.status = 400;
        ctx.body={messsge:"Unable to Add todo",  error:err}
    }
})

//Update Todo by id
//@method PUT
//@route /todos/:id

router.put("/todos/:id", async(ctx,next)=>{
    try{
        const {title,completed}= ctx.request.body
        const updatedTodo = await Todos.findByIdAndUpdate(ctx.params.id,{title},{completed},{new:true});
        if(updatedTodo){
            ctx.body = updatedTodo
        }
        else{
            ctx.status = 404;
            ctx.body = {messsge:"Todo Not Found"}
        }
        
    }
    catch(err){
        ctx.status = 400;
        ctx.body={messsge:"Error Updating todo",  error:err}
    }
})



//Delete Todo by id
//@method DEL
//@route /todos/:id

router.del("/todos/:id", async(ctx,next)=>{
    try{
        const deletedTodo = await Todos.findByIdAndDelete(ctx.params.id);
        if(deletedTodo){
            ctx.body = deletedTodo
        }
        else{
            ctx.status = 404;
            ctx.body = {messsge:"Todo Not Found"}
        }
    }
    catch(err){
        ctx.status = 500;
        ctx.body={messsge:"Error Deleting todo",  error:err}
    }
})






app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})