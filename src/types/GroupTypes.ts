import mongoose, { Document, ObjectId } from "mongoose";
import UserRoleEnum from "../enums/UserRoleEnum";

interface ItemType {
    name: string;
    price: number;
    quantity: string;
}

interface Members {
    userID: ObjectId;
    deductAmount: Number;
}

interface ItemsType {
    addedBy: ObjectId;
    broughtBy: ObjectId;
    message?: string;
    title: string;
    funds: Number;
    includedMembers: Members[];
    item: ItemType[];
    totalPrice: number;
    date: Date;
    createdAt: Date;
}

interface UserType {
    role: UserRoleEnum;
    userID: ObjectId;
}

export interface GroupTypes extends Document {
    groupName: string;
    groupLogo: string;
    groupTitle: string;
    createdBy: ObjectId;
    funds: Number;
    request: any[]
    items: ItemsType[];
    users: UserType[];
    updatedAt: Date;
}
