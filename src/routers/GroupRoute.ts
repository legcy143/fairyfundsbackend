import Router from 'express';
import { verifyToken } from '../middlewares/VerifyToken';
import {  AddItemsInGroup, CreateNewGroup, DeleteGroup, DeleteInviteLink, FetchGroupByID, FetchMyGroup, GroupInviteResponse, InviteLinkGenerator, LeaveGroup, PromoteOrDemoteAsAdmin, SendRequest } from '../controller/GroupController';

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

// fetch user group
GroupRoute.get("/fetchmygroup", verifyToken, FetchMyGroup)
GroupRoute.get("/fetchgroup/:groupID", verifyToken, FetchGroupByID)


//product action route
GroupRoute.post("/additem", verifyToken, AddItemsInGroup)






export default GroupRoute