import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectToMongoDB from "./config/DB";
import UserRoute from "./routers/UserRoute";
import GroupRoute from "./routers/GroupRoute";
import asyncHandler from "./utils/handler/asyncHandler";
import { errorResponse, successResponse } from "./utils/response/Response";
import Group from "./Schema/Group";
import UserRoleEnum from "./enums/UserRoleEnum";

const app: Express = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "*",
}))

connectToMongoDB()

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        status: true,
        message: "Hello gyus"
    })
})

let healthHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // let arr:any = {a:34};   // run error part
    // arr.map((e:any)=>{console.log(e)})
   return successResponse(res , 200 , "OK");
});

// Route with a function containing try-catch block
app.get("/health", healthHandler);
app.get("/test" , asyncHandler(async(req:Request,res:Response)=>{
    const {groupID , userID} = req.body
    let group;
    group = await Group.findOneAndUpdate(
        { 
            _id: groupID ,
            "users.role": UserRoleEnum.Admin,
            "users.memberID": userID ,
        },
        {
            
            funds:45,
        },
        { new: true }
    ).populate({
        path: 'users.memberID',
        select: 'userName',
    })
    return successResponse(res , 200 , undefined , group)
}))

app.use("/api/v1/user", UserRoute)
app.use("/api/v1/group", GroupRoute)

app.get("*", asyncHandler(async(req: Request, res: Response) => {
  return errorResponse(res , 404 , "Not Found")
}))

export default app;