import { Request, Response } from "express";
import Group from "../Schema/Group";
import UserRoleEnum from "../enums/UserRoleEnum";
import User from "../Schema/User";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import { SecretKeyConverter, decryption, encryption } from "../utils/security/Hasing";
import { GroupPopulater } from "../helper/pouplater/GroupPopulater";


export const CreateNewGroup: any = asyncHandler(async (req: Request, res: Response) => {
    const { groupName, groupBio, groupLogo, userID } = req.body;
    let group = await Group.create({
        createdBy: userID,
        groupOwner: userID,
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
    await group.populate(GroupPopulater)

    return res.status(200).send({
        success: true,
        message: "Group Created Succesfully",
        group
    })
})
export const DeleteGroup: any = asyncHandler(async (req: Request, res: Response) => {
    const { userID, groupID } = req.body;
    let group = await Group.findOneAndDelete(
        {
            'groupOwner': userID,
            '_id': groupID,
        }
    )
    if (!group) {
        return errorResponse(res, 401, 'Group only delete by group owner')
    }
    return successResponse(res, 200, 'Group Deleted Successfully')


})
export const LeaveGroup: any = asyncHandler(async (req: Request, res: Response) => {
    const { userID, groupID } = req.body;
    if (!groupID || !userID) {
        return errorResponse(res, 400, 'Data missing went wrong')
    }
    let group = await Group.findOneAndUpdate(
        {
            'groupOwner': { $ne: userID },
            'users.memberID': userID,
            '_id': groupID
        },
        {
            $pull: {
                users: { memberID: userID }
            }

        },
        { new: true }
    )
    if (group) {
        return successResponse(res, 200)
    }
    return errorResponse(res, 403, 'Group owner cannot leave group')


})

export const FetchMyGroup = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body;
    let groupData = await Group.find({ "users.memberID": userID }).populate(GroupPopulater).lean();

    let groups = groupData.map((e: any) => {
        let isAdmin = false;
        let isOwner = false;
        let myCredit = 0;
        e?.users.map((user: any) => {
            if (user?.memberID?._id == userID) {
                isAdmin = user?.role == UserRoleEnum.Admin
                isOwner = userID == e?.groupOwner
                myCredit = user?.credit
                return 0;
            }
            // console.log("hehe" ,e._id , user.memberID._id == userID)
        })
        return { isAdmin, isOwner, myCredit, ...e };
    })
    groups.reverse();
    if (groupData) {
        return successResponse(res, 200, undefined, groups)
    }
})

// need to finish
export const FetchGroupByID = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body;
    const { groupID } = req.params
    let group:any = await Group.findOne({
        "users.memberID": userID,
        "_id": groupID
    }).populate(GroupPopulater)
    if (group) {
        let isAdmin = false;
        let isOwner = false;
        let myCredit = 0;
        group?.users.map((user: any) => {
            if (user?.memberID?._id == userID) {
                isAdmin = user?.role == UserRoleEnum.Admin
                isOwner = userID == group?.groupOwner
                myCredit = user?.credit
                return 0;
            }
        })
        group = group.toObject();
        return successResponse(res, 200, 'group found', {
            ...group, isAdmin, isOwner, myCredit
        })
    }
    return errorResponse(res, 404, 'Group Not Found')
})

export const AddItemsInGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, broughtBy, message, title, includedMembers, item, date } = req.body
    if (!title || !broughtBy || !item) {
        throw new Error("all  fields are required")
    }
    // initialize total price
    let totalPrice = 0;

    // update total price
    item?.map((e: any) => {
        totalPrice += parseInt(e?.price)
    })
    // console.log(totalPrice , typeof totalPrice)
    let group: any = await Group.findById({ _id: groupID });
    let val = parseFloat((totalPrice / group?.users.length).toFixed(3));
    group = await Group.findOneAndUpdate(
        {
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },

        },
        {

            $inc: {
                funds: -totalPrice,
                'users.$[].credit': -val
            },
            // funds: totalFund - totalPrice,
            $push: {
                items: {
                    $each: [{ addedBy: userID ?? "NA", broughtBy, message, title, includedMembers, item, totalPrice, date }],
                    $position: 0,
                },
            }
        },
        { new: true }
    ).populate(GroupPopulater)
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
    const reqBody = JSON.stringify({ groupID, userID, dateTime });
    let secretkey = SecretKeyConverter(process.env.INVITE_KEY_SECRET as string);
    const sk = encryption(reqBody, secretkey);
    if (sk == -1) {
        return errorResponse(res);
    }
    let group = await Group.findOneAndUpdate(
        {
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },

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
    ).populate(GroupPopulater)
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
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },

        },
        {
            $pull: {
                inviteKeys: {
                    _id: inviteKeyID
                },
            }
        },
        { new: true }
    ).populate(GroupPopulater)
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
    const { groupID, userID, memberID, isAccept } = req.body
    let member: any = await User.find({ _id: memberID })
    if (!member) {
        return errorResponse(res, 404, 'User Not Found')
    }

    const commonQuery = {
        _id: groupID,
        "request.memberID": memberID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum.Admin,
            },
        },
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
    group = await Group.findOneAndUpdate(commonQuery, updatedData, { new: true }).populate(GroupPopulater)

    if (!group) {
        return errorResponse(res, 404, "No Request Found")
    }
    let message = isAccept ? "join request successfully" : "Request Rejected"
    return successResponse(res, 200, message, group)
})

export const RemoveMember = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, memberID } = req.body
    const commonQuery = {
        _id: groupID,
        "users.memberID": memberID,
        "groupOwner":userID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum.Admin,
            },
        },
    };


    let group;
    group = await Group.findOneAndUpdate(commonQuery,
         {$pull: {
            users: { memberID }
        }}
        , { new: true }).populate(GroupPopulater)

    if (group) {
        return successResponse(res, 200, "remove from group succesfully", group)
    }
    return errorResponse(res, 404, "Only Group Owner remove group member")
})


// on user actions
export const PromoteOrDemoteAsAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { groupID, userID, memberID, isPromote } = req.body
    // console.log(memberID , userID , memberID == userID)
    // member is is not member id it is member object
    if (memberID._id == userID) {
        return errorResponse(res, 400, "some thing went wrong")
    }
    const action = {
        $set: {
            'users.$.role': isPromote ? UserRoleEnum.Admin : UserRoleEnum.Member,
        },
        $push: {
            activity: {
                $each: [{
                    title: "Group update v2.2",
                    message: `${memberID.userName} ${isPromote ? " Promote as Group admin " : " Demote as group admin"} `
                }],
                $position: 0,
                $slice: 20,
            },
        },
    }
    let group;
    group = await Group.findOneAndUpdate({
        _id: groupID,
        "users.memberID": memberID,
        'groupOwner': userID,
    },
        action,
        { new: true }).populate(GroupPopulater)

    if (group) {

        let data = JSON.stringify({ groupID });
        let message = isPromote ? "you are promoted as group admin " : "you are demote as admin"
        let user = await User.findOneAndUpdate(
            { _id: memberID._id },
            {
                $push: {
                    notifications: {
                        $each: [{
                            title: "Group update",
                            message: `${message} from group ${group.groupName}, visit group for more detail`,
                            data,
                        }],
                        $position: 0,
                    }
                }
            },
            { new: true }
        )
        let resMessage = isPromote ? "Promote as a admin Successfully" : "Demote as a admin successfully"
        return successResponse(res, 200, resMessage, group)
    }
    return errorResponse(res, 404, "something went wrong")
})

//manage funds
export const ManageUserCredit = asyncHandler(async (req: Request, res: Response) => {
    const { amount, userID, memberID, groupID } = req.body;
    let val = parseFloat((amount).toFixed(3));
    let group: any = await Group.findOneAndUpdate(
        {
            _id: groupID,
            "users.memberID": memberID,
            'groupOwner': userID,
        },
        {
            $inc: {
                funds: +amount,
                'users.$.credit': +val
            },
            $push: {
                activity: {
                    $each: [{
                        title: "Fund update",
                        message: ` ${memberID.userName} fund was update by ${val}`,
                    }],
                    $position: 0,
                    $slice: 20,
                },
            },
        },
        { new: true }
    ).populate(GroupPopulater);
    if (group) {
        let data = JSON.stringify({ groupID })
        let user = await User.findOneAndUpdate(
            { _id: memberID._id },
            {
                $push: {
                    notifications: {
                        $each: [{
                            title: "Fund update",
                            message: `your fund was update in group ${group.groupName} by  ${val}, see your current amount`,
                            data,
                        }],
                        $position: 0,
                    }
                }
            },
            { new: true }
        )
        // console.log("notification to user ",user)
        return successResponse(res, 200, undefined, group)
    }
    // console.log(group)
    return errorResponse(res, 404, "Funds only manage by group owner")
})

// todos
export const AddTodo = asyncHandler(async (req: Request, res: Response) => {
    const { userID, groupID, todo } = req.body
    let group = await Group.findOneAndUpdate(
        {
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },
        },
        {
            $push: {
                todos: {
                    $each: [{
                        todo,
                        createdBy: userID,
                    }],
                    $position: 0,
                    $slice: 20,
                }
            }
        },
        { new: true },
    ).populate(GroupPopulater)

    if (group) {
        return successResponse(res, 200, "Added todo Sucessfully", group)
    }
    return errorResponse(res, 404, "Group not found")
})
export const MarkAsDoneTodo = asyncHandler(async (req: Request, res: Response) => {
    const { userID, groupID, todoID } = req.body
    let group = await Group.findOneAndUpdate(
        {
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },
            'todos._id': todoID,
        },
        {
            $set: {
                'todos.$.isDone': true
            }
        },
        { new: true },
    ).populate(GroupPopulater)

    if (group) {
        return successResponse(res, 200, "Added todo Sucessfully", group)
    }
    return errorResponse(res, 404, "Group not found")
})
export const DeleteTodo = asyncHandler(async (req: Request, res: Response) => {
    const { userID, groupID, todoID } = req.body
    let group = await Group.findOneAndUpdate(
        {
            _id: groupID,
            users: {
                $elemMatch: {
                    memberID: userID,
                    role: UserRoleEnum.Admin
                }
            },
            'todos._id': todoID,
        },
        {
            $pull: {
                'todos': { _id: todoID }
            }
        },
        { new: true },
    ).populate(GroupPopulater)

    if (group) {
        return successResponse(res, 200, "delete Todo successfully", group)
    }
    return errorResponse(res, 404, "Group not found")
})