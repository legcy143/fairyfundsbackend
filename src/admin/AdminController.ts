import { Request, Response } from "express";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import User from "../Schema/User";
import Group from "../Schema/Group";
import { GroupPopulater } from "../helper/pouplater/GroupPopulater";

let groupAdminPopulater = [...GroupPopulater,
{    path: 'groupOwner',
    select: ['userName', 'bio']
},
{    path: 'createdBy',
    select: ['userName', 'bio']
}
]

export const FetchAllUser = asyncHandler(async (req: Request, res: Response) => {
    let users = await User.find({ }).select('+lastVisit +createdAt')
  
    return successResponse(res, 200, undefined, users)
})
export const FetchAllGroup = asyncHandler(async (req: Request, res: Response) => {
    let group = await Group.find({}).populate(groupAdminPopulater).select('+updatedAt +createdAt')
    return successResponse(res, 200, undefined, group)
})