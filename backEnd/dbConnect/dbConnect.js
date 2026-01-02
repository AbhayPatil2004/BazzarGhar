import mongoose from 'mongoose'

async function connectTODB(){

    try{
        const mongoUrl = process.env.MONGO_URL 

        if( !mongoUrl ){
            throw new error("MONGO_URI is not defined in environment variables")
        }

        await mongoose.connect(mongoUrl)
        console.log(" Database connected successfully");
        
    }
    catch(error){
        console.log("Error in Connecting to Database" , error.message)
        process.exit()
    }
}

export default connectTODB