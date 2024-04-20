import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './src/routers/user.router.js';
import adminRouter from './src/routers/admin.router.js';
import levelRouter from './src/routers/level.router.js';
import versionRouter from './src/routers/versionRouter.js';
import progressamountRouter from './src/routers/progressamount.router.js';
//import achievementRouter from './src/routers/achievement.router.js';

import cors from 'cors';

import connectDB from './src/config/db.config.js';
import challengeRouter from './src/routers/user.challenge.route.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan('common'));

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/level",levelRouter);
//app.use("/achievement",achievementRouter);
app.use("/version",versionRouter);
app.use('/challenge',challengeRouter);
app.use('/progressamount',progressamountRouter);


const port = process.env.PORT || 7000;
app.listen(port,()=>{
    connectDB();
    console.log(`Server : http://localhost:${port}`);
})