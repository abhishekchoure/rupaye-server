import { turso } from "../../db.js";

export const createUserTransaction = async (transaction, userId) => {
  const result = await turso.execute({
    sql: "INSERT INTO transactions (id, name, amount, timestamp, category_id, user_id) VALUES (?,?,?,?,?,?)",
    args: [
      transaction.id,
      transaction.name,
      transaction.amount,
      transaction.timestamp,
      transaction.category_id,
      userId,
    ],
  });

  return result.rowsAffected === 1;
};

export const getUserTransactions = async (userId) => {
  const result = await turso.execute({
    sql: "SELECT transactions.id, transactions.name, transactions.amount, transactions.timestamp, categories.name as category_name from transactions, categories WHERE transactions.category_id = categories.id AND transactions.user_id=?",
    args: [userId],
  });
  return result.rows;
};
