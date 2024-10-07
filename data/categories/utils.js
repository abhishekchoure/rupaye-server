import { turso } from "../../db.js";

export const createUserCategory = async (category, userId) => {
  const result = await turso.execute({
    sql: "INSERT INTO categories (id, name, type, budget_amount, user_id) values (?,?,?,?,?)",
    args: [category.id, category.name, category.type, category.budget, userId],
  });

  return result.rowsAffected === 1;
};

export const getUserCategories = async (userId) => {
  const result = await turso.execute({
    sql: "SELECT id, name, type, budget_amount FROM categories WHERE user_id = ?",
    args: [userId],
  });

  return result.rows;
};
