import { Request, Response } from "express";
import Group from "../Schema/Group";
import UserRoleEnum from "../enums/UserRoleEnum";
import User from "../Schema/User";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";

export const CreateNewGroup: any = asyncHandler(async (req: Request, res: Response) => {
    const { groupName, groupBio, groupLogo, userID } = req.body;
    let group = await Group.create({
        createdBy: userID,
        groupLogo,
        groupName,
        groupBio,
        users: [
            {
                role: UserRoleEnum.Admin,
                memberID: userID,
            },
        ],
    })
    return res.status(200).send({
        success: true,
        message: "Group Created Succesfully",
        group
    })
})

export const FetchMyGroup = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body;
    let groups = await Group.find({ "users.memberID": userID }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    groups.reverse();
    return res.status(200).send({
        success: true,
        groups,
    })
})

// need to finish
export const FetchGroupByID = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body;
    const { groupID } = req.params
    let group = await Group.findOne({
        "users.memberID": userID,
        "_id": groupID
    }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    // console.log(groupID,group)
    if (!group)
        return errorResponse(res, 404, 'Group Not Found')
    else
        return successResponse(res, 200, 'group found', group)
})

export const AddItemsInGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, broughtBy, message, title, includedMembers, item, date } = req.body
    // addedBy - userID // now name// default from jwt
    // broughtBy - userid which is must be in group
    // message - optional
    // title - required
    // funds: calculated by pre "save" // function in scheema;
    // includedMembers: [username];
    // product: [{name , price , quantity}];
    // totalPrice: number;
    // date: when product baught update from user;
    // createdAt: Date;
    if (!title || !broughtBy || !item) {
        throw new Error("all  fields are required")
    }

    // initialize total price
    let totalPrice = 0;

    // update total price
    item?.map((e: any) => {
        totalPrice += e?.price
    })

    // get group and user who is try to get user detail who try to add item 
    let group = await Group.findById({ _id: groupID });
    let addedByUser: any = await User.findById({ _id: userID })

    // if there is no group or no user then return this
    if (!group || !addedByUser) {
        return res.status(404).send({
            success: false,
            message: "Group Not Found or invalid user",
        })
    }

    // check for user is admin or not 
    // code...

    // this current amount per person
    let totalFund: any = group?.funds;
    // console.log(group?.funds)
    group = await Group.findOneAndUpdate(
        { _id: groupID },
        {
            funds: totalFund - totalPrice,
            $push: {
                items: {
                    $each: [{ addedBy: addedByUser?.userName ?? "NA", broughtBy, message, title, includedMembers, item, totalPrice, date }],
                    $position: 0,

                },
            }
        },
        { new: true }
    ).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    return res.status(200).send({
        success: true,
        message: "Added Item Successfuly",
        group
    })
})




// add user in group functionality
export const InviteLinkGenerator = asyncHandler((req: Request, res: Response) => {
    const { gropuID, userID } = req.body;
})

export const SendRequest = asyncHandler(() => {

})


export const AddMember = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, memberID } = req.body
    let group;
    let member: any = await User.find({ _id: memberID })
    if (!member) {
        throw new Error("something went wrong")
    }
    group = await Group.findOneAndUpdate(
        {
            "users.memberID": userID,
            "users.role": UserRoleEnum.Admin,
            "_id": groupID,
        },
        {
            $push: {
                users: {
                    memberID
                },
            }
        },
        { new: true }
    ).populate({
        path: 'users.memberID',
        select: 'userName',
    })
    if (!group) {
        return errorResponse(res, 404, "Group Not Found")
    }
    return successResponse(res, 200, undefined , group)
})
