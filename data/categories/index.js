import express from "express";
import { nanoid } from "nanoid";
import { createUserCategory, getUserCategories, getUserMonthlyBudget} from "../categories/utils.js";
import { userCookieCheck } from "../../middleware/cookie.js";
const categoriesRouter = express.Router();

categoriesRouter.use(userCookieCheck);

categoriesRouter.get("/", async (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);

  try {
    const categories = await getUserCategories(userCookie.id);
    res.status(200).json({
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting categories of a user" });
  }
});

categoriesRouter.get("/budget", async (req, res) => {
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

categoriesRouter.post("/category", async (req, res) => {
  console.log(req.body);
  const { name, type, budget } = req.body;
  const userCookie = JSON.parse(req.cookies.user);
  const id = nanoid(10);

  // TODO: sanitize category details
  const category = { id, name, type, budget };

  try {
    await createUserCategory(category, userCookie.id);
    res.status(200).json({
        message: "Category created successfully"
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating new category" });
  }
});

export default categoriesRouter;
