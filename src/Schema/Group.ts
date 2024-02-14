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
                // type: String,
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            broughtBy: {
                // type: String,
                type: Schema.Types.ObjectId,
                ref: 'User',
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
    todos: [
        {
            todo: {
                type: String,
            },
            isDone: {
                type: Boolean,
                default: false,
            },
            createdBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            mentioned: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref:'User'
                    }
                }
            ],
            createdAt: {
                type: Date,
                default: new Date(),
            }
        }
    ],
    activity: [
        {
            message: {
                type: String,
            },
            title: {
                type: String,
            },
            data: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: new Date(),
            }
        }
    ],
    inviteKeys: [
        {
            key: {
                type: String,
            },
            IV: {
                type: String,
            },
            genrateBy: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: new Date(),
            },

        }
    ],
}, { timestamps: true })


const Group = mongoose.model<GroupTypes>("Group", GroupSchema);
export default Group;