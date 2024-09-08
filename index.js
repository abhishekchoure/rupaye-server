import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
import authRouter from "./auth/index.js";
import categoriesRouter from "./data/categories/index.js";
import transactionsRouter from "./data/transactions/index.js"

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })  
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`rupaye-server listening on port ${PORT}`);
});
