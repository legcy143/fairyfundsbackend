import http from "http"
import app from "./app";
import axios from "axios";
const port = process.env.PORT || 5555;
const server = http.createServer(app)


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port} ::[${new Date().toLocaleString()}]`)
}) 




let wait = 5000;
async function HealthCheck() {
  let isRun = true;
  while (isRun) {
    try {
      await new Promise((resolve) => setTimeout(resolve, wait));
      wait = Math.floor(Math.random() * 30000) + 2000;
      let res = await axios.get(process.env.PROD_URL+"/health")
      console.log("Health : ", res?.data?.status);
    } catch (error) {
      isRun = false;
      console.error("Health Check Error: ", error);
    }
  }
}
HealthCheck();