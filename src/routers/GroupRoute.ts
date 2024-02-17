import Router from 'express';
import { verifyToken } from '../middlewares/VerifyToken';
import {  AddItemsInGroup, AddTodo, CreateNewGroup, DeleteGroup, DeleteInviteLink, DeleteTodo, FetchGroupByID, FetchMyGroup, GroupInviteResponse, InviteLinkGenerator, LeaveGroup, ManageUserCredit, MarkAsDoneTodo, PromoteOrDemoteAsAdmin, RemoveMember, SendRequest } from '../controller/GroupController';

const GroupRoute = Router();

// all gruop route starts with .....urls/v{}/group/

// create and delete group
GroupRoute.post("/create", verifyToken, CreateNewGroup)
GroupRoute.post("/delete", verifyToken, DeleteGroup)

// add member actions
GroupRoute.post("/leave", verifyToken, LeaveGroup);
GroupRoute.post("/promoteordemoteasadmin", verifyToken, PromoteOrDemoteAsAdmin);
GroupRoute.post("/groupinviteresponse", verifyToken, GroupInviteResponse);
GroupRoute.post("/genrateinvitelink" , verifyToken ,InviteLinkGenerator)
GroupRoute.post("/removeinvitelink" , verifyToken ,DeleteInviteLink)
GroupRoute.post("/sendrequest" , verifyToken ,SendRequest)
GroupRoute.post("/removemember" , verifyToken , RemoveMember)

// fetch user group
GroupRoute.get("/fetchmygroup", verifyToken, FetchMyGroup)
GroupRoute.get("/fetchgroup/:groupID", verifyToken, FetchGroupByID)

//user'd end actions
GroupRoute.post("/manageusercredit" , verifyToken , ManageUserCredit)


//product action route
GroupRoute.post("/additem", verifyToken, AddItemsInGroup)

// group todo actions
GroupRoute.post("/todo/add", verifyToken, AddTodo)
GroupRoute.post("/todo/done", verifyToken, MarkAsDoneTodo)
GroupRoute.post("/todo/delete", verifyToken, DeleteTodo)






export default GroupRoute