import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.routes";
import bodyParser from 'body-parser';


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/api", indexRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Travel Hunt API");
});

export default app;
