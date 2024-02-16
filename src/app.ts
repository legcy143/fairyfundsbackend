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
import AdminRoute from "./routers/AdminRoute";
import { SendMail } from "./helper/SendMail";

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
   return successResponse(res , 200 , "OK" , {version:1});
});

// Route with a function containing try-catch block
app.get("/health", healthHandler);
app.get("/test" , asyncHandler(async(req:Request,res:Response)=>{
    let boiler = ()=>{
        return "<h1>every thing is ok</h1>"
    }
    let email = "legcy143@gmail.com"
    let resp = await SendMail(email ,undefined , boiler);
    console.log("response " ,resp)
    return successResponse(res , 200 , undefined)
}))

app.use(`/api/v1/user`, UserRoute)
app.use(`/api/v1/group`, GroupRoute)
app.use(`/api/v1/admin`, AdminRoute)

app.get("*", asyncHandler(async(req: Request, res: Response) => {
  return errorResponse(res , 404 , "Route Not Found , Invalid Route")
}))
app.post("*", asyncHandler(async(req: Request, res: Response) => {
  return errorResponse(res , 404 , "Route Not Found , Invalid Route")
}))

export default app;