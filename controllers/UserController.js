import signale from "signale";
import sanitizeHtml from "sanitize-html";
import UserModel from "../models/User.js";
import {
  validateSafeString,
  validateEmail,
  validateExistingStrings,
} from "./validators.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
/**
 * key to decode the token
 * @type string
 */
const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const safeEmail = sanitizeHtml(email).trim();
    const safePassword = sanitizeHtml(password).trim();

    if (!validateExistingStrings([safeEmail, safePassword])) {
      return res.status(400).json({
        success: false,
        message: "Email and password cannot be empty",
      });
    }

    if (!validateEmail(safeEmail) || !validateSafeString(safePassword)) {
      return res.status(400).json({
        success: false,
        message: "Request data is invalid or malformed",
      });
    }

    const user = await UserModel.findOne({ where: { email: safeEmail } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user was found",
      });
    }

    const isPasswordValid = await bcrypt.compare(safePassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      token,
      message: "User has been authenticated",
    });
  } catch (error) {
    signale.error(`Error in login request.\n${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in login request.\n${error.message}`,
    });
  }
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const safeUsername = sanitizeHtml(username).trim();
    const safeEmail = sanitizeHtml(email).trim();
    const safePassword = sanitizeHtml(password).trim();
    if (!validateExistingStrings([safeUsername, safeEmail, safePassword])) {
      return res.status(400).json({
        success: false,
        message: "username, email and password cannot be empty",
      });
    }
    if (
      !validateSafeString(safeUsername) ||
      !validateEmail(safeEmail) ||
      !validateSafeString(safePassword)
    ) {
      return res.status(400).json({
        success: false,
        message: "request data is invalid or malformed",
      });
    }

    const existingUser = await UserModel.findOne({
      where: { email: safeEmail },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const newUser = await UserModel.create({
      username: safeUsername,
      email: safeEmail,
      password: safePassword,
    });
    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "couldn't create a new user",
      });
    }
    await newUser.save();
    return res.status(201).json({
      success: true,
      user: newUser,
      message: "new user created",
    });
  } catch (error) {
    signale.error(`error in register request.\n${error.message}`);
    return res.status(500).json({
      success: false,
      message: `error in register request.\n${error.message}`,
    });
  }
}

async function editUser(req, res) {
  try {
    const { newUsername, newEmail, newPassword } = req.body;

    const safeNewUsername = newUsername
      ? sanitizeHtml(newUsername).trim()
      : null;
    const safeNewEmail = newEmail ? sanitizeHtml(newEmail).trim() : null;
    const safeNewPassword = newPassword
      ? sanitizeHtml(newPassword).trim()
      : null;

    if (!safeNewUsername && !safeNewEmail && !safeNewPassword) {
      return res.status(400).json({
        success: false,
        message: "At least one of the new data fields must be provided",
      });
    }

    const updates = {};
    if (safeNewUsername && validateSafeString(safeNewUsername)) {
      updates.username = safeNewUsername;
    }
    if (safeNewEmail && validateEmail(safeNewEmail)) {
      updates.email = safeNewEmail;
    }
    if (safeNewPassword && validateSafeString(safeNewPassword)) {
      updates.password = await bcrypt.hash(safeNewPassword, 10);
    }

    await req.user.update(updates);

    return res.status(200).json({
      success: true,
      user: req.user,
      message: "User edited successfully",
    });
  } catch (error) {
    signale.error("Error in edit request\n" + error);
    return res.status(500).json({
      success: false,
      message: "Error in edit request\n" + error,
    });
  }
}

async function deleteUser(req, res) {
  try {
    await req.user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    signale.error("Error in delete request\n" + error);
    return res.status(500).json({
      success: false,
      message: "Error in delete request\n" + error,
    });
  }
}

const userController = {
  login,
  register,
  editUser,
  deleteUser,
};

export default userController;
