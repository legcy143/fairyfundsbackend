"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPopulater = void 0;
exports.GroupPopulater = [
    {
        path: 'users.memberID',
        select: 'userName',
    },
    {
        path: 'request.memberID',
        select: ['userName', 'bio']
    }
];