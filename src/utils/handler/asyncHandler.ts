import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../response/Response"

export default function asyncHandler(innerFunc: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await innerFunc(req, res, next);
        } catch (error) {
            console.log("!from asynchandler == ",error)
            return errorResponse(res)
        }
    }
};
