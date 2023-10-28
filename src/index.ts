import express from "express";
import "dotenv/config";
import routes from "./Routes/index";
import cors from "cors";
import { backgroundWorker, deleteQueue } from "./config/AMWPConfig";
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
  credentials: true,
  origin: "http://localhost:5173" 
}));
app.use(cookieParser());

app.use(express.static("./widgets"));
app.use(routes);

app.listen(process.env.PORT_EXPRESS, async () => {
  console.log("Server listening on port", process.env.PORT_EXPRESS);
  backgroundWorker();
// deleteQueue("queue")
});
