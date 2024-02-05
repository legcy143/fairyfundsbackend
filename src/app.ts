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
import { SecretKeyConverter, decryption, encryption } from "./utils/security/Hasing";

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
   let a = {a:'hii' , b:'hello'};
   let data  = JSON.stringify(a);
   let secretkey = SecretKeyConverter(process.env.INVITE_KEY_SECRET as string)
   const sk = encryption(data , secretkey);
//    if -1 return error else it create blunder
   console.log(sk);
   let dec;
   if(sk != -1){
       let d1:any = decryption(sk.encrypted , sk.iv , secretkey)
       dec = JSON.parse(d1);
   }
    return successResponse(res , 200 , undefined , {sk , dec},)
}))

app.use("/api/v1/user", UserRoute)
app.use("/api/v1/group", GroupRoute)

app.get("*", asyncHandler(async(req: Request, res: Response) => {
  return errorResponse(res , 404 , "Not Found")
}))

export default app;