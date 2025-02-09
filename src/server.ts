import http from "http"
import app from "./app";
import axios from "axios";
const port = process.env.PORT || 5555;
const server = http.createServer(app)


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port} ::[${new Date().toLocaleString()}]`)
}) 




let timer = setInterval(async() => {
    try {
        let res = await axios.get(process.env.PROD_URL+"/health")
        console.log("console for prevent auto stop service in server.ts line no.7" , res.data)
    } catch (error) {
        console.log("error in server.ts line no.7" , error)        
    }
}, 3000);