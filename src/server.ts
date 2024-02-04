import http from "http"
import app from "./app";
const port = process.env.PORT || 5555;
const server = http.createServer(app)

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port} ::[${new Date().toLocaleString()}]`)
}) 