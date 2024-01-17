import { Request, Response } from "express";
import Group from "../Schema/Group";
import UserRoleEnum from "../enums/UserRoleEnum";
import User from "../Schema/User";

export const CreateNewGroup = async (req: Request, res: Response) => {
    try {
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

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const FetchMyGroup = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const AddItemsInGroup = async (req: Request, res: Response) => {
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
    try {
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
        // this current amount per person
        let totalFund: any = group?.funds;
        console.log(group?.funds)
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
        )
        return res.status(200).send({
            success: true,
            message: "Added Item Successfuly",
            group
        })
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
        })
    }

}


export const AddMember = async (req: Request, res: Response) => {
    const { groupID, userID, memberID } = req.body
    try {
        let group;
        let member: any = await User.find({ _id: memberID })
        if (!member) {
            throw new Error("something went wrong")
        }
        group = await Group.findOneAndUpdate(
            { _id: groupID },
            {
                $push: {
                    users: {
                        memberID
                    },
                }
            },
            { new: true }
        )
        if (!group) {
            return res.status(404).send({
                success: false,
                message: "Group Not Found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "member added Successfuly",
            group
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }

}