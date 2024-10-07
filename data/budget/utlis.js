import { turso } from "../../db.js";

export const getUserLastFiveMonthsBudget = async (userId) => {
  try {
    const result = await turso.execute({
      sql: `
      SELECT strftime('%Y-%m', created_at) AS month, SUM(amount) AS total_amount
      FROM transactions
      WHERE user_id = ?
      AND created_at >= DATE('now', 'start of month', '-5 months')
      AND created_at < DATE('now', 'start of month', '+1 month')
      GROUP BY month
      ORDER BY month;
    `,
      args: [userId],
    });
    console.log(result)
    return result.rows;
  } catch (err) {
    console.error(err);
  }

};

export const getUserMonthlyBudget = async (userId) => {
  const result = await turso.execute({
    sql: "SELECT c.id as id, c.name as name, c.budget_amount as budget, COALESCE(sum(t.amount),0) as spent FROM categories c LEFT JOIN transactions t ON c.id = t.category_id AND c.user_id = t.user_id AND strftime('%Y-%m',t.created_at) = strftime('%Y-%m','now') WHERE c.user_id = ? GROUP BY c.id, c.name, c.budget_amount ORDER BY c.name",
    args: [userId],
  });

  return result.rows;
};
