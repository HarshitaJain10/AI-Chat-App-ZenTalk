import dotenv from "dotenv";
dotenv.config();

const getOpenaiResponse=async(messages)=>{
    const options={
        method:"POST",
        headers:{
            Authorization: `Bearer ${process.env.OPEN_KEY}`,
			"Content-Type": "application/json",
        },
        body: JSON.stringify({
            model:"MiniMaxAI/MiniMax-M2.5:novita",
            messages:messages
        })
    };
    try{
        const response=await fetch("https://router.huggingface.co/v1/chat/completions",options);
        const data=await response.json();
        //console.log(data);
        return (data.choices[0].message.content);  //reply
    }catch(err){
        console.log(err);
    }
};

export default getOpenaiResponse;