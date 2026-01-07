import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import connectTODB from './dbConnect/dbConnect.js';
import { connectRedis } from './redisConnect/redisConnect.js';
import userRouter from './routes/user.route.js';
import storeRouter from './routes/store.route.js'
import adminRouter from './routes/admin.route.js'
import productRouter from './routes/product.route.js'

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,               
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/store" , storeRouter )
app.use("/admin",adminRouter) 
app.use("/product" , productRouter )

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectTODB();
    console.log("MongoDB connected");

    await connectRedis();
    console.log("Redis connected");

    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
