import express from "express";
import {
  checkIfUserAlreadyExist,
  createNewUser,
  getUser,
} from "../auth/utils.js";
import { hash, compare } from "bcrypt";
import { nanoid } from "nanoid";

const SALT_ROUNDS = 10;

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Verify req.body
  if (
    !req.body.hasOwnProperty("name") ||
    !req.body.hasOwnProperty("email") ||
    !req.body.hasOwnProperty("password")
  ) {
    res.status(501).json({
      error: "Incomplete user details for signup process",
    });
    return;
  }

  // TODO: Sanitize user details for signup

  const { name, email, password } = req.body;
  const doesUserAlreadyExist = await checkIfUserAlreadyExist(email);

  if (doesUserAlreadyExist) {
    res.status(501).json({
      error: "Your Email ID already exist with an another account",
    });
    return;
  }

  const id = nanoid(10);
  const hashedPassword = await hash(password, SALT_ROUNDS);
  const user = { id, name, email, password: hashedPassword };

  try {
    createNewUser(user);
    res.status(200).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error(err);
    res.status(501).json({
      error: "Error signing up. Try again later ...",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  // If user has cookie, directly login
  if (req.cookies.user) {
    res.status(200).json({
      message: "Login successfull",
    });
    return;
  }

  // Verify req.body
  if (
    !req.body.hasOwnProperty("email") ||
    !req.body.hasOwnProperty("password")
  ) {
    res.status(501).json({
      error: "Incomplete user details for login process",
    });
    return;
  }

  // TODO: Sanitize user details for login

  const { email, password } = req.body;
  const user = await getUser(email);

  // Verify Email ID
  if (user === null) {
    res.status(200).json({
      error: "Email ID is incorrect. If you are new, first create your account",
    });
    return;
  }

  // Verify Password
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    res.status(200).json({
      error: "Password is incorrect",
    });
    return;
  }

  // Set secure cookie session
  res.cookie(
    "user",
    { id: user.id, name: user.name, email: user.email },
    {
      maxAge: 100 * 60 * 30,
      httpOnly: true,
      secure: true,
    }
  );

  res.status(200).json({
    message: "Login successfull",
  });
});

authRouter.post("/logout", (req, res) => {
  res.cookie(
    "user",
    {},
    {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    }
  );

  res.json({
    message: "Logout successfull",
  });
});

export default authRouter;
