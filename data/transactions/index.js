import express from "express";
import {
  createUserTransaction,
  getUserTransactions,
} from "../transactions/utils.js";
import { userCookieCheck } from "../../middleware/cookie.js";
import { nanoid } from "nanoid";

const transactionsRouter = express.Router();
transactionsRouter.use(userCookieCheck);

transactionsRouter.get("/", async (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);
  console.log(userCookieCheck);
  
  try {
    const transactions = await getUserTransactions(userCookie.id);
    res.status(200).json({
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting transactions of a user" });
  }
});

transactionsRouter.get("/transaction", (req, res) => {});

transactionsRouter.post("/transaction", async (req, res) => {
  const { name, amount, date, category } = req.body;
  const userCookie = JSON.parse(req.cookies.user);
  const id = nanoid(10);

  // TODO: sanitize transcation details
  const transaction = {
    id,
    name,
    amount,
    timestamp: date,
    category_id: category,
  };

  try {
    await createUserTransaction(transaction, userCookie.id);
    res.status(200).json({
      message: "Transcation added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding a new transaction" });
  }
});

export default transactionsRouter;
