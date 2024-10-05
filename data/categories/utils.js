import { turso } from "../../db.js";

export const createUserCategory = async (category, userId) => {
    const result = await turso.execute({
        sql: "INSERT INTO categories (id, name, type, budget_amount, user_id) values (?,?,?,?,?)",
        args: [category.id, category.name, category.type, category.budget, userId]
    })

    return result.rowsAffected === 1;
}

export const getUserCategories = async (userId) => {
    const result = await turso.execute({
        sql: "SELECT id, name, type, budget_amount FROM categories WHERE user_id = ?",
        args: [userId]
    })

    return result.rows;
}

export const getUserMonthlyBudget = async(userId) => {
    const result = await turso.execute({
        sql: "SELECT c.id as id, c.name as name, c.budget_amount as budget, COALESCE(sum(t.amount),0) as spent FROM categories c LEFT JOIN transactions t ON c.id = t.category_id AND c.user_id = t.user_id AND strftime('%Y-%m',t.created_at) = strftime('%Y-%m','now') WHERE c.user_id = ? GROUP BY c.id, c.name, c.budget_amount ORDER BY c.name",
        args: [userId]
    })

    return result.rows;
}
