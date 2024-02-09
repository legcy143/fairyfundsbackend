"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoteOrDemoteAsAdmin = exports.GroupInviteResponse = exports.SendRequest = exports.DeleteInviteLink = exports.InviteLinkGenerator = exports.AddItemsInGroup = exports.FetchGroupByID = exports.FetchMyGroup = exports.LeaveGroup = exports.DeleteGroup = exports.CreateNewGroup = void 0;
const Group_1 = __importDefault(require("../Schema/Group"));
const UserRoleEnum_1 = __importDefault(require("../enums/UserRoleEnum"));
const User_1 = __importDefault(require("../Schema/User"));
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
const Hasing_1 = require("../utils/security/Hasing");
let GroupPopulateObj = [
    {
        path: 'users.memberID',
        select: 'userName',
    },
    {
        path: 'request.memberID',
        select: ['userName', 'bio']
    }
];
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
    await group.populate(GroupPopulateObj);
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
    let groups = await Group_1.default.find({ "users.memberID": userID }).populate(GroupPopulateObj);
    groups.reverse();
    return res.status(200).send({
        success: true,
        groups,
    });
});
// need to finish
exports.FetchGroupByID = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    const { groupID } = req.params;
    let group = await Group_1.default.findOne({
        "users.memberID": userID,
        "_id": groupID
    }).populate(GroupPopulateObj);
    if (!group)
        return (0, Response_1.errorResponse)(res, 404, 'Group Not Found');
    else
        return (0, Response_1.successResponse)(res, 200, 'group found', group);
});
exports.AddItemsInGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, broughtBy, message, title, includedMembers, item, date } = req.body;
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
        throw new Error("all  fields are required");
    }
    // initialize total price
    let totalPrice = 0;
    // update total price
    item?.map((e) => {
        totalPrice += e?.price;
    });
    // get group and user who is try to get user detail who try to add item 
    let group = await Group_1.default.findById({ _id: groupID });
    let addedByUser = await User_1.default.findById({ _id: userID });
    // if there is no group or no user then return this
    if (!group || !addedByUser) {
        return res.status(404).send({
            success: false,
            message: "Group Not Found or invalid user",
        });
    }
    // check for user is admin or not 
    // code...
    // this current amount per person
    let totalFund = group?.funds;
    group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        users: {
            $elemMatch: {
                memberID: userID,
                role: UserRoleEnum_1.default.Admin
            }
        },
    }, {
        funds: totalFund - totalPrice,
        $push: {
            items: {
                $each: [{ addedBy: addedByUser?.userName ?? "NA", broughtBy, message, title, includedMembers, item, totalPrice, date }],
                $position: 0,
            },
        }
    }, { new: true }).populate(GroupPopulateObj);
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
    }, { new: true }).populate(GroupPopulateObj);
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
    }, { new: true }).populate(GroupPopulateObj);
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
    group = await Group_1.default.findOneAndUpdate(commonQuery, updatedData, { new: true }).populate(GroupPopulateObj);
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, "No Request Found");
    }
    let message = isAccept ? "join request successfully" : "Request Rejected";
    return (0, Response_1.successResponse)(res, 200, message, group);
});
// on user actions
exports.PromoteOrDemoteAsAdmin = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, memberID, isPromote } = req.body;
    const action = {
        $set: {
            'users.$.role': isPromote ? UserRoleEnum_1.default.Admin : UserRoleEnum_1.default.Member
        }
    };
    let group;
    group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        "users.memberID": memberID,
        'groupOwner': userID,
    }, action, { new: true }).populate(GroupPopulateObj);
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, "something went wrong");
    }
    let message = isPromote ? "Promote as a admin Successfully" : "Demote as a admin successfully";
    return (0, Response_1.successResponse)(res, 200, message, group);
});
