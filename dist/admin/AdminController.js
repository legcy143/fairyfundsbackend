"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllGroup = exports.FetchAllUser = void 0;
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
const User_1 = __importDefault(require("../Schema/User"));
const Group_1 = __importDefault(require("../Schema/Group"));
const GroupPopulater_1 = require("../helper/pouplater/GroupPopulater");
let groupAdminPopulater = [...GroupPopulater_1.GroupPopulater,
    { path: 'groupOwner',
        select: ['userName', 'bio']
    },
    { path: 'createdBy',
        select: ['userName', 'bio']
    }
];
exports.FetchAllUser = (0, asyncHandler_1.default)(async (req, res) => {
    let users = await User_1.default.find({}).select('+lastVisit +createdAt');
    return (0, Response_1.successResponse)(res, 200, undefined, users);
});
exports.FetchAllGroup = (0, asyncHandler_1.default)(async (req, res) => {
    let group = await Group_1.default.find({}).populate(groupAdminPopulater).select('+updatedAt +createdAt');
    return (0, Response_1.successResponse)(res, 200, undefined, group);
});
