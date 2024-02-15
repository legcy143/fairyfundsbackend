"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTodo = exports.MarkAsDoneTodo = exports.AddTodo = exports.ManageUserCredit = exports.PromoteOrDemoteAsAdmin = exports.GroupInviteResponse = exports.SendRequest = exports.DeleteInviteLink = exports.InviteLinkGenerator = exports.AddItemsInGroup = exports.FetchGroupByID = exports.FetchMyGroup = exports.LeaveGroup = exports.DeleteGroup = exports.CreateNewGroup = void 0;
const Group_1 = __importDefault(require("../Schema/Group"));
const UserRoleEnum_1 = __importDefault(require("../enums/UserRoleEnum"));
const User_1 = __importDefault(require("../Schema/User"));
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
const Hasing_1 = require("../utils/security/Hasing");
const GroupPopulater_1 = require("../helper/pouplater/GroupPopulater");
exports.CreateNewGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupName, groupBio, groupLogo, userID } = req.body;
    let group = await Group_1.default.create({
        createdBy: userID,
        groupOwner: userID,
        groupLogo,
        groupName,
        groupBio,
        users: [
            {
                role: UserRoleEnum_1.default.Admin,
                memberID: userID,
            },
        ],
    });
    await group.populate(GroupPopulater_1.GroupPopulater);
    return res.status(200).send({
        success: true,
        message: "Group Created Succesfully",
        group
    });
});
exports.DeleteGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, groupID } = req.body;
    let group = await Group_1.default.findOneAndDelete({
        'groupOwner': userID,
        '_id': groupID,
    });
    if (!group) {
        return (0, Response_1.errorResponse)(res, 401, 'Group only delete by group owner');
    }
    return (0, Response_1.successResponse)(res, 200, 'Group Deleted Successfully');
});
exports.LeaveGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, groupID } = req.body;
    if (!groupID || !userID) {
        return (0, Response_1.errorResponse)(res, 400, 'Data missing went wrong');
    }
    let group = await Group_1.default.findOneAndUpdate({
        'groupOwner': { $ne: userID },
        'users.memberID': userID,
        '_id': groupID
    }, {
        $pull: {
            users: { memberID: userID }
        }
    }, { new: true });
    if (group) {
        return (0, Response_1.successResponse)(res, 200);
    }
    return (0, Response_1.errorResponse)(res, 403, 'Group owner cannot leave group');
});
exports.FetchMyGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    let groupData = await Group_1.default.find({ "users.memberID": userID }).populate(GroupPopulater_1.GroupPopulater).lean();
    let groups = groupData.map((e) => {
        let isAdmin = false;
        let isOwner = false;
        let myCredit = 0;
        e?.users.map((user) => {
            if (user?.memberID?._id == userID) {
                isAdmin = user?.role == UserRoleEnum_1.default.Admin;
                isOwner = userID == e?.groupOwner;
                myCredit = user?.credit;
                return 0;
            }
            // console.log("hehe" ,e._id , user.memberID._id == userID)
        });
        return { isAdmin, isOwner, myCredit, ...e };
    });
    groups.reverse();
    if (groupData) {
        return (0, Response_1.successResponse)(res, 200, undefined, groups);
    }
});
// need to finish
exports.FetchGroupByID = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    const { groupID } = req.params;
    let group = await Group_1.default.findOne({
        "users.memberID": userID,
        "_id": groupID
    }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        let isAdmin = false;
        let isOwner = false;
        let myCredit = 0;
        group?.users.map((user) => {
            if (user?.memberID?._id == userID) {
                isAdmin = user?.role == UserRoleEnum_1.default.Admin;
                isOwner = userID == group?.groupOwner;
                myCredit = user?.credit;
                return 0;
            }
        });
        group = group.toObject();
        return (0, Response_1.successResponse)(res, 200, 'group found', {
            ...group, isAdmin, isOwner, myCredit
        });
    }
    return (0, Response_1.errorResponse)(res, 404, 'Group Not Found');
});
exports.AddItemsInGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, broughtBy, message, title, includedMembers, item, date } = req.body;
    if (!title || !broughtBy || !item) {
        throw new Error("all  fields are required");
    }
    // initialize total price
    let totalPrice = 0;
    // update total price
    item?.map((e) => {
        totalPrice += parseInt(e?.price);
    });
    // console.log(totalPrice , typeof totalPrice)
    let group = await Group_1.default.findById({ _id: groupID });
    let val = parseFloat((totalPrice / group?.users.length).toFixed(3));
    group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
    }, {
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
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    return res.status(200).send({
        success: true,
        message: "Added Item Successfuly",
        group
    });
});
// add user in group functionality
exports.InviteLinkGenerator = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID } = req.body;
    if (!groupID || !userID) {
        return (0, Response_1.errorResponse)(res, 404, 'Resource Not Found');
    }
    const dateTime = new Date().toLocaleString();
    const reqBody = JSON.stringify({ groupID, userID, dateTime });
    let secretkey = (0, Hasing_1.SecretKeyConverter)(process.env.INVITE_KEY_SECRET);
    const sk = (0, Hasing_1.encryption)(reqBody, secretkey);
    if (sk == -1) {
        return (0, Response_1.errorResponse)(res);
    }
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
    }, {
        $push: {
            inviteKeys: {
                key: sk.encrypted,
                IV: sk.iv
            },
        }
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, 'Group Not Found');
    }
    return (0, Response_1.successResponse)(res, 200, undefined, group);
});
// delete invite key user in group functionality
exports.DeleteInviteLink = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, inviteKeyID } = req.body;
    if (!groupID || !userID) {
        return (0, Response_1.errorResponse)(res, 404, 'Resource Not Found');
    }
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
    }, {
        $pull: {
            inviteKeys: {
                _id: inviteKeyID
            },
        }
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, 'Group Not Found');
    }
    return (0, Response_1.successResponse)(res, 200, undefined, group);
});
exports.SendRequest = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, inviteKey, IV } = req.body;
    let secretkey = (0, Hasing_1.SecretKeyConverter)(process.env.INVITE_KEY_SECRET);
    const decrData = (0, Hasing_1.decryption)(inviteKey, IV, secretkey);
    if (decrData == -1) {
        return (0, Response_1.errorResponse)(res);
    }
    let parsedData = JSON.parse(decrData);
    let group = await Group_1.default.findOne({
        "users.memberID": userID,
        "_id": parsedData.groupID,
    });
    if (group) {
        return (0, Response_1.errorResponse)(res, 409, 'Already A Group Member');
    }
    group = await Group_1.default.findOneAndUpdate({
        _id: parsedData.groupID,
        "request.memberID": { $ne: userID }
    }, {
        $push: {
            request: { memberID: userID }
        }
    }, { new: true });
    if (!group) {
        return (0, Response_1.errorResponse)(res, 409, 'Request already send');
    }
    return (0, Response_1.successResponse)(res, 200, 'Request Send Successfully');
});
exports.GroupInviteResponse = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, memberID, isAccept } = req.body;
    let member = await User_1.default.find({ _id: memberID });
    if (!member) {
        return (0, Response_1.errorResponse)(res, 404, 'User Not Found');
    }
    const commonQuery = {
        _id: groupID,
        "request.memberID": memberID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin,
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
    group = await Group_1.default.findOneAndUpdate(commonQuery, updatedData, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, "No Request Found");
    }
    let message = isAccept ? "join request successfully" : "Request Rejected";
    return (0, Response_1.successResponse)(res, 200, message, group);
});
// on user actions
exports.PromoteOrDemoteAsAdmin = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, memberID, isPromote } = req.body;
    // console.log(memberID , userID , memberID == userID)
    // member is is not member id it is member object
    if (memberID._id == userID) {
        return (0, Response_1.errorResponse)(res, 400, "some thing went wrong");
    }
    const action = {
        $set: {
            'users.$.role': isPromote ? UserRoleEnum_1.default.Admin : UserRoleEnum_1.default.Member,
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
    };
    let group;
    group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        "users.memberID": memberID,
        'groupOwner': userID,
    }, action, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        let data = JSON.stringify({ groupID });
        let message = isPromote ? "you are promoted as group admin " : "you are demote as admin";
        let user = await User_1.default.findOneAndUpdate({ _id: memberID._id }, {
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
        }, { new: true });
        let resMessage = isPromote ? "Promote as a admin Successfully" : "Demote as a admin successfully";
        return (0, Response_1.successResponse)(res, 200, resMessage, group);
    }
    return (0, Response_1.errorResponse)(res, 404, "something went wrong");
});
//manage funds
exports.ManageUserCredit = (0, asyncHandler_1.default)(async (req, res) => {
    const { amount, userID, memberID, groupID } = req.body;
    let val = parseFloat((amount).toFixed(3));
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        "users.memberID": memberID,
        'groupOwner': userID,
    }, {
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
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        let data = JSON.stringify({ groupID });
        let user = await User_1.default.findOneAndUpdate({ _id: memberID._id }, {
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
        }, { new: true });
        // console.log("notification to user ",user)
        return (0, Response_1.successResponse)(res, 200, undefined, group);
    }
    // console.log(group)
    return (0, Response_1.errorResponse)(res, 404, "Funds only manage by group owner");
});
exports.AddTodo = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, groupID, todo } = req.body;
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
    }, {
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
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        return (0, Response_1.successResponse)(res, 200, "Added todo Sucessfully", group);
    }
    return (0, Response_1.errorResponse)(res, 404, "Group not found");
});
exports.MarkAsDoneTodo = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, groupID, todoID } = req.body;
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
        'todos._id': todoID,
    }, {
        $set: {
            'todos.$.isDone': true
        }
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        return (0, Response_1.successResponse)(res, 200, "Added todo Sucessfully", group);
    }
    return (0, Response_1.errorResponse)(res, 404, "Group not found");
});
exports.DeleteTodo = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID, groupID, todoID } = req.body;
    let group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
        'todos._id': todoID,
    }, {
        $pull: {
            'todos': { _id: todoID }
        }
    }, { new: true }).populate(GroupPopulater_1.GroupPopulater);
    if (group) {
        return (0, Response_1.successResponse)(res, 200, "delete Todo successfully", group);
    }
    return (0, Response_1.errorResponse)(res, 404, "Group not found");
});
