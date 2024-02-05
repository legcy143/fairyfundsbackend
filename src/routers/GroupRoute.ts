import Router from 'express';
import { verifyToken } from '../middlewares/VerifyToken';
import {  AddItemsInGroup, CreateNewGroup, DeleteInviteLink, FetchGroupByID, FetchMyGroup, GroupInviteResponse, InviteLinkGenerator, SendRequest } from '../controller/GroupController';

const GroupRoute = Router();

// all gruop route starts with .....urls/v{}/group/
// create group
GroupRoute.post("/create", verifyToken, CreateNewGroup)

// add member actions
GroupRoute.post("/groupinviteresponse", verifyToken, GroupInviteResponse);
GroupRoute.post("/genrateinvitelink" , verifyToken ,InviteLinkGenerator)
GroupRoute.post("/removeinvitelink" , verifyToken ,DeleteInviteLink)
GroupRoute.post("/sendrequest" , verifyToken ,SendRequest)

// fetch user group
GroupRoute.get("/fetchmygroup", verifyToken, FetchMyGroup)
GroupRoute.get("/fetchgroup/:groupID", verifyToken, FetchGroupByID)


// add product route
GroupRoute.post("/additem", verifyToken, AddItemsInGroup)






export default GroupRoute