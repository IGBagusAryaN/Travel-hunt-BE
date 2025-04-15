import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", indexRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Travel Hunt API");
});

export default app;
