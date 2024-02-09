import mongoose, { Schema } from "mongoose";
import { GroupTypes } from "../types/GroupTypes";
import UserRoleEnum from "../enums/UserRoleEnum";

const GroupSchema: Schema<GroupTypes> = new Schema<GroupTypes>({
    groupName: {
        type: String,
        required: true,
    },
    groupLogo: {
        type: String,
        default: ""
    },
    groupBio: {
        type: String,
        default: "fairyfunds"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    funds: {
        type: Number,
        default: 0,
    },
    users: [
        {
            role: {
                type: String,
                default: UserRoleEnum.Member,
            },
            memberID: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            credit: {
                type: Number,
                default: 0
            }
        }
    ],
    request: [
        {
            memberID: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
    items: [
        {
            addedBy: {
                type: String,
                required: true,
            },
            broughtBy: {
                type: String,
                required: true,
            },
            message: {
                type: String,
            },
            title: {
                type: String,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
            includedMembers: [
                {
                    userName: {
                        type: String,
                        required: true
                    },
                    deductAmount: {
                        type: Number,
                        default: 0,
                    }
                }
            ],
            item: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                    quantity: {
                        type: String,
                        default: "",
                        required: true
                    }
                }
            ],
            date: {
                type: Date,
                default: new Date()
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }
    ],
    inviteKeys:[
        {
            key:{
                type:String,
            },
            IV:{
                type:String,
                // select:false,
            },
            genrateBy:{
                type:String,
            },
            createdAt:{
                type: Date,
                default: new Date(),
            },

        }
    ],
    createdAt:{
        type: Date,
        default: new Date(),
        select: false,
    },
    updatedAt: {
        select: false,
        type: Date,
        default: new Date()
    }
})


// GroupSchema.pre<any>('findOneAndUpdate', async function (next: any) {
//     try {
//         console.log("hii there from group schema pre  function")
//         console.log(this.schema.obj.users)
//         const totalCredits: any = this.schema.obj.users.reduce((total: any, user: any) => total + user.credit, 0);
//         this.funds = totalCredits;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
const Group = mongoose.model<GroupTypes>("Group", GroupSchema);
export default Group;