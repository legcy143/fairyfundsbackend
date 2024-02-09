"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPermissionEnum = void 0;
var AdminTypeEnum;
(function (AdminTypeEnum) {
    AdminTypeEnum["Owner"] = "owner";
    AdminTypeEnum["Moderater"] = "moderater";
})(AdminTypeEnum || (AdminTypeEnum = {}));
var AdminPermissionEnum;
(function (AdminPermissionEnum) {
    AdminPermissionEnum["All"] = "all";
    AdminPermissionEnum["View"] = "view";
})(AdminPermissionEnum || (exports.AdminPermissionEnum = AdminPermissionEnum = {}));
exports.default = AdminTypeEnum;
