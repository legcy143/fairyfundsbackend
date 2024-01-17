import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectToMongoDB from "./config/DB";
import UserRoute from "./routers/UserRoute";
import GroupRoute from "./routers/GroupRoute";

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
        message: "Hello gyus"
    })
})

app.use("/api/v1/user", UserRoute)
app.use("/api/v1/group", GroupRoute)

export default app;