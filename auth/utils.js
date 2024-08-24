import { turso } from "../db.js";

export const checkIfUserAlreadyExist = async (email) => {
  try {
    const result = await turso.execute({
      sql: "SELECT email FROM users where email=?",
      args: [email],
    });

    return result.rows.length > 0;
  } catch (err) {
    console.error(err);
    throw new Error("Server Error: Failure checking if email already exist");
  }
};

export const createNewUser = async ({ id, name, email, password }) => {
  try {
    await turso.execute({
      sql: "INSERT INTO users (id, name, email, password) values (?,?,?,?)",
      args: [id, name, email, password],
    });
  } catch (err) {
    console.error(err);
    throw new Error("Server Error: Failure in creating new user");
  }
};

export const getUser = async (email) => {
  try {
    const result = await turso.execute({
      sql: "SELECT id, name, email, password FROM users WHERE email=?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Server Error: Failure in getting a user");
  }
};
