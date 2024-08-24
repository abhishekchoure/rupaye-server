import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
import authRouter from "./auth/index.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter)

app.listen(PORT, () => {
  console.log(`rupaye-server listening on port ${PORT}`);
});
