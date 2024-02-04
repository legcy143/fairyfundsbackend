import { Response } from "express"


export const errorResponse = (
    res?: Response,
    statusCode:number = 500,
    message:string = "Internal Server Error",
    data?:any,
    isSuccess: boolean = false,
) => {
    return res?.status(statusCode).send({
        success: isSuccess,
        message,
        data
    })
}
export const successResponse = (
    res?: Response,
    statusCode:number = 200,
    message:string = "success",
    data?:any,
    isSuccess: boolean = true,
) => {
    return res?.status(statusCode).send({
        success: isSuccess,
        message,
        data,
    })
}
