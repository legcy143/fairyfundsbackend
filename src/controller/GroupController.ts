import { Request, Response } from "express";
import Group from "../Schema/Group";
import UserRoleEnum from "../enums/UserRoleEnum";
import User from "../Schema/User";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import { SecretKeyConverter, decryption, encryption } from "../utils/security/Hasing";

let GroupPopulateObj = [
    {
        path: 'users.memberID',
        select: 'userName',
    },
    {
        path: 'request.memberID',
        select: ['userName', 'bio']
    }
]

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
    });
    await group.populate(GroupPopulateObj)

    return res.status(200).send({
        success: true,
        message: "Group Created Succesfully",
        group
    })
})

export const FetchMyGroup = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body;
    let groups = await Group.find({ "users.memberID": userID }).populate(GroupPopulateObj);
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
    }).populate(GroupPopulateObj)
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
    ).populate(GroupPopulateObj)
    return res.status(200).send({
        success: true,
        message: "Added Item Successfuly",
        group
    })
})




// add user in group functionality
export const InviteLinkGenerator = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID } = req.body;
    if (!groupID || !userID) {
        return errorResponse(res, 404, 'Resource Not Found')
    } 
    const dateTime = new Date().toLocaleString();
    const reqBody = JSON.stringify({ groupID, userID , dateTime});
    let secretkey = SecretKeyConverter(process.env.INVITE_KEY_SECRET as string);
    const sk = encryption(reqBody, secretkey);
    if (sk == -1) {
        return errorResponse(res);
    }
    let group = await Group.findOneAndUpdate(
        {
            "users.memberID": userID,
            "users.role": UserRoleEnum.Admin,
            "_id": groupID,
        },
        {
            $push: {
                inviteKeys: {
                    key: sk.encrypted,
                    IV: sk.iv
                },
            }
        },
        { new: true }
    ).populate(GroupPopulateObj)
    if (!group) {
        return errorResponse(res, 404, 'Group Not Found')
    }
    return successResponse(res, 200, undefined, group)
})
// delete invite key user in group functionality
export const DeleteInviteLink = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, inviteKeyID } = req.body;
    if (!groupID || !userID) {
        return errorResponse(res, 404, 'Resource Not Found')
    }
    let group = await Group.findOneAndUpdate(
        {
            "users.memberID": userID,
            "users.role": UserRoleEnum.Admin,
            "_id": groupID,
        },
        {
            $pull: {
                inviteKeys: {
                    _id: inviteKeyID
                },
            }
        },
        { new: true }
    ).populate(GroupPopulateObj)
    if (!group) {
        return errorResponse(res, 404, 'Group Not Found')
    }
    return successResponse(res, 200, undefined, group)
})

export const SendRequest = asyncHandler(async (req: Request, res: Response) => {
    const { userID, inviteKey, IV } = req.body;
    let secretkey = SecretKeyConverter(process.env.INVITE_KEY_SECRET as string);
    const decrData = decryption(inviteKey, IV, secretkey);
    if (decrData == -1) {
        return errorResponse(res);
    }
    let parsedData = JSON.parse(decrData);
    let group = await Group.findOne({
        "users.memberID": userID,
        "_id": parsedData.groupID,
    })
    if (group) {
        return errorResponse(res, 409, 'Already A Group Member')
    }
    group = await Group.findOneAndUpdate(
        {
            _id: parsedData.groupID,
            "request.memberID": { $ne: userID }
        },
        {
            $push: {
                request: { memberID: userID }
            }
        },
        { new: true },
    );

    if (!group) {
        return errorResponse(res, 409, 'Request already send')
    }
    return successResponse(res, 200, 'Request Send Successfully')

})


export const GroupInviteResponse = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, memberID, isAccept = false } = req.body
    let member: any = await User.find({ _id: memberID })
    if (!member) {
        return errorResponse(res, 404, 'User Not Found')
    }

    const commonQuery = {
        "users.memberID": userID,
        "users.role": UserRoleEnum.Admin,
        "_id": groupID,
        "request.memberID": memberID
    };

    const updatedData = {
        $pull: {
            request: { memberID }
        },
        ...(isAccept && {
            $push: {
                users: { memberID }
            }
        })
    };

    let group;
    group = await Group.findOneAndUpdate(commonQuery, updatedData, { new: true }).populate(GroupPopulateObj)

    if (!group) {
        return errorResponse(res, 404, "No Request Found")
    }
    let message = isAccept ? "join request successfully"  : "Request Rejected"
    return successResponse(res, 200, message, group)
})

