import express from "express";
import { userCookieCheck } from "../../middleware/cookie.js";
import { getUserLastFiveMonthsBudget, getUserMonthlyBudget } from "./utlis.js";

const budgetRouter = express.Router();
budgetRouter.use(userCookieCheck);

budgetRouter.get("/months/total", async (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);
  try {
    const budget = await getUserLastFiveMonthsBudget(userCookie.id);
    res.status(200).json({
      budget
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error getting 5 months budget of a user" });
  }
});

budgetRouter.get("/month/categorywise", async (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);

  try {
    const budget = await getUserMonthlyBudget(userCookie.id);
    res.status(200).json({
      budget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting budget for user" });
  }
});

export default budgetRouter;
