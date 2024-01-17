"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VerifyToken_1 = require("../middlewares/VerifyToken");
const GroupController_1 = require("../controller/GroupController");
const GroupRoute = (0, express_1.default)();
// create group
GroupRoute.post("/create", VerifyToken_1.verifyToken, GroupController_1.CreateNewGroup);
// add member to group
GroupRoute.post("/addmember", VerifyToken_1.verifyToken, GroupController_1.AddMember);
// fetch user group
GroupRoute.get("/fetchmygroup", VerifyToken_1.verifyToken, GroupController_1.FetchMyGroup);
// edit group 
// add product route
GroupRoute.post("/additem", VerifyToken_1.verifyToken, GroupController_1.AddItemsInGroup);
/**
{
  "groupID": "65847059267a3beee6422b21",
  "broughtBy": "6584163e303dbed93ef48a75",
  "message": "ok test message done",
  "title": "sheetal grocery",
  "includedMembers": [
    {
      "userID": "6584163e303dbed93ef48a75",
      "deductAmount": 12
    }
  ],
  "product": [
    {
      "name": "abc sabzi",
      "price": 120,
      "quantity": "1kg"
    },
    {
      "name": "abc sabzi 3",
      "price": 120,
      "quantity": "2kg"
    }
  ],
  "totalPrice": 120
}

 */
// fetch group data route
exports.default = GroupRoute;
