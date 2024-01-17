"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMember = exports.AddItemsInGroup = exports.FetchMyGroup = exports.CreateNewGroup = void 0;
const Group_1 = __importDefault(require("../Schema/Group"));
const UserRoleEnum_1 = __importDefault(require("../enums/UserRoleEnum"));
const User_1 = __importDefault(require("../Schema/User"));
const CreateNewGroup = async (req, res) => {
    try {
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.CreateNewGroup = CreateNewGroup;
const FetchMyGroup = async (req, res) => {
    try {
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.FetchMyGroup = FetchMyGroup;
const AddItemsInGroup = async (req, res) => {
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
    try {
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
        // this current amount per person
        let totalFund = group?.funds;
        console.log(group?.funds);
        group = await Group_1.default.findOneAndUpdate({ _id: groupID }, {
            funds: totalFund - totalPrice,
            $push: {
                items: {
                    $each: [{ addedBy: addedByUser?.userName ?? "NA", broughtBy, message, title, includedMembers, item, totalPrice, date }],
                    $position: 0,
                },
            }
        }, { new: true });
        return res.status(200).send({
            success: true,
            message: "Added Item Successfuly",
            group
        });
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.AddItemsInGroup = AddItemsInGroup;
const AddMember = async (req, res) => {
    const { groupID, userID, memberID } = req.body;
    try {
        let group;
        let member = await User_1.default.find({ _id: memberID });
        if (!member) {
            throw new Error("something went wrong");
        }
        group = await Group_1.default.findOneAndUpdate({ _id: groupID }, {
            $push: {
                users: {
                    memberID
                },
            }
        }, { new: true });
        if (!group) {
            return res.status(404).send({
                success: false,
                message: "Group Not Found",
            });
        }
        return res.status(200).send({
            success: true,
            message: "member added Successfuly",
            group
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.AddMember = AddMember;
