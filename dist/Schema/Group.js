"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserRoleEnum_1 = __importDefault(require("../enums/UserRoleEnum"));
const GroupSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                default: UserRoleEnum_1.default.Member,
            },
            memberID: {
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
    items: [
        {
            addedBy: {
                // type: String,
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            broughtBy: {
                // type: String,
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
            mentioned: [
                {
                    user: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'User'
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
}, { timestamps: true });
const Group = mongoose_1.default.model("Group", GroupSchema);
exports.default = Group;
