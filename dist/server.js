"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 5555;
const server = http_1.default.createServer(app_1.default);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port} ::[${new Date().toLocaleString()}]`);
});
let timer = setInterval(() => {
    console.log("console for prevewnt auto stop service in server.ts line no.7");
}, 3000);
