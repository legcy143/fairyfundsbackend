"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VerifyToken_1 = require("../middlewares/VerifyToken");
const GroupController_1 = require("../controller/GroupController");
const GroupRoute = (0, express_1.default)();
// all gruop route starts with .....urls/v{}/group/
// create and delete group
GroupRoute.post("/create", VerifyToken_1.verifyToken, GroupController_1.CreateNewGroup);
GroupRoute.post("/delete", VerifyToken_1.verifyToken, GroupController_1.DeleteGroup);
// add member actions
GroupRoute.post("/leave", VerifyToken_1.verifyToken, GroupController_1.LeaveGroup);
GroupRoute.post("/promoteordemoteasadmin", VerifyToken_1.verifyToken, GroupController_1.PromoteOrDemoteAsAdmin);
GroupRoute.post("/groupinviteresponse", VerifyToken_1.verifyToken, GroupController_1.GroupInviteResponse);
GroupRoute.post("/genrateinvitelink", VerifyToken_1.verifyToken, GroupController_1.InviteLinkGenerator);
GroupRoute.post("/removeinvitelink", VerifyToken_1.verifyToken, GroupController_1.DeleteInviteLink);
GroupRoute.post("/sendrequest", VerifyToken_1.verifyToken, GroupController_1.SendRequest);
// fetch user group
GroupRoute.get("/fetchmygroup", VerifyToken_1.verifyToken, GroupController_1.FetchMyGroup);
GroupRoute.get("/fetchgroup/:groupID", VerifyToken_1.verifyToken, GroupController_1.FetchGroupByID);
//product action route
GroupRoute.post("/additem", VerifyToken_1.verifyToken, GroupController_1.AddItemsInGroup);
exports.default = GroupRoute;
