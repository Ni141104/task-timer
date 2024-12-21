import mongoose from "mongoose";

let isConnected=false;


export const connectToDB=async()=>{
    mongoose.set('strictQuery',true)
    if(isConnected)
        {
            console.log('Mongo DB is already connected');
            return;
        }

        try {
            await mongoose.connect(process.env.MONGODB_URL,{
                dbName:"timetask",
                useNewUrlParser:true,
                useUnifiedTopology:true,
             
            })

            isConnected=true;
            console.log('Mongo Db connected successfully')
    
        } catch (error) {
            console.log(error);
        }
}
