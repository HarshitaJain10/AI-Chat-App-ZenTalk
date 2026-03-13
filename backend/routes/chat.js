import express from 'express';
import Thread from '../models/Thread.js';
import getOpenaiResponse from '../utils/openai.js';

const router = express.Router();

router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"XYG",
            title:"tsbvds"
        });
        const response=await thread.save();
        res.send(response);

    }catch(error){
        console.log(error);
        res.status(500).json({error:"failed to save"});

    }

});



//all thread
router.get("/threads",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        res.json(threads);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"failed to fetch threads"});
    }});

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId});
        if(!thread){
            res.status(400).json({error:"thread not found"});
        }
        res.json(thread.messages);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"failed to fetch chat"});
    }
});

//delete thread
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
try{
    const deletedThread= await Thread.findOneAndDelete({threadId});
    if(!deletedThread){
        res.status(400).json({error:"thread could not be deleted"});
    }
    res.status(200).json({success:"thread deleted"});
}catch(error){
    console.log(error);
    res.status(500).json({error:"failed to delete thread"});
}});

//chat
router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"missing required fields"});
    }
    try{
        let thread=await Thread.findOne({threadId});
        if(!thread){
            thread=new Thread({
                //create a new thread
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            });
        }else{
            thread.messages.push({role:"user",content:message});            
        }
            const assistantReply=await getOpenaiResponse(thread.messages);
            thread.messages.push({role:"assistant",content:assistantReply});
            thread.updatedAt=new Date();
            await thread.save();
            res.json({ reply: assistantReply });
       
    }catch(error){
        console.log(error);
        res.status(500).json({error:"failed to send message"});
    }
});
export default router;