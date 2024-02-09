import { Response } from "express"


export const errorResponse = (
    res?: Response,
    statusCode: number = 500,
    message: string = "Internal Server Error",
    data?: any,
) => {
    return res?.status(statusCode).send({
        success: false,
        message,
        data,
    })
}
export const successResponse = (
    res?: Response,
    statusCode: number = 200,
    message: string = "success",
    data?: any,
) => {
    return res?.status(statusCode).send({
        success: true,
        message,
        data,
    })
}
