"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMember = exports.SendRequest = exports.InviteLinkGenerator = exports.AddItemsInGroup = exports.FetchGroupByID = exports.FetchMyGroup = exports.CreateNewGroup = void 0;
const Group_1 = __importDefault(require("../Schema/Group"));
const UserRoleEnum_1 = __importDefault(require("../enums/UserRoleEnum"));
const User_1 = __importDefault(require("../Schema/User"));
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
exports.CreateNewGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupName, groupBio, groupLogo, userID } = req.body;
    let group = await Group_1.default.create({
        createdBy: userID,
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
    return res.status(200).send({
        success: true,
        message: "Group Created Succesfully",
        group
    });
});
exports.FetchMyGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    let groups = await Group_1.default.find({ "users.memberID": userID }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
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
    }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    // console.log(groupID,group)
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
    // console.log(group?.funds)
    group = await Group_1.default.findOneAndUpdate({ _id: groupID }, {
        funds: totalFund - totalPrice,
        $push: {
            items: {
                $each: [{ addedBy: addedByUser?.userName ?? "NA", broughtBy, message, title, includedMembers, item, totalPrice, date }],
                $position: 0,
            },
        }
    }, { new: true }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    return res.status(200).send({
        success: true,
        message: "Added Item Successfuly",
        group
    });
});
// add user in group functionality
exports.InviteLinkGenerator = (0, asyncHandler_1.default)((req, res) => {
    const { gropuID, userID } = req.body;
});
exports.SendRequest = (0, asyncHandler_1.default)(() => {
});
exports.AddMember = (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID, memberID } = req.body;
    let group;
    let member = await User_1.default.find({ _id: memberID });
    if (!member) {
        throw new Error("something went wrong");
    }
    group = await Group_1.default.findOneAndUpdate({
        "users.memberID": userID,
        "users.role": UserRoleEnum_1.default.Admin,
        "_id": groupID,
    }, {
        $push: {
            users: {
                memberID
            },
        }
    }, { new: true }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    if (!group) {
        return (0, Response_1.errorResponse)(res, 404, "Group Not Found");
    }
    return (0, Response_1.successResponse)(res, 200, undefined, group);
});
