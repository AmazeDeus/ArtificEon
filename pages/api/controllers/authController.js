require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { API } from "@/config";

const isProduction = process.env.NODE_ENV === "production";
const domain = isProduction ? new URL(API).hostname : "";

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser.id,
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET, // terminal -> "node" -> require("crypto").randomBytes(64).toString("hex")
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET, // terminal -> "node" -> require("crypto").randomBytes(64).toString("hex")
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.setHeader(
    "Set-Cookie",
    `jwt=${refreshToken}; HttpOnly; Secure; SameSite=None; Max-Age=${
      //accessible only by web server, //https, //cross-site cookie. REST api may be hosted on one server, and the app on another server
      7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT (7 days)
    }${isProduction ? `; Domain=${domain}` : ""}; Path=/`
  );

  // Send accessToken containing username and roles
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  // If refresh token was valid, get a new access token using refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser.id,
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.setHeader(
    "Set-Cookie",
    `jwt=; HttpOnly; Secure; SameSite=None; Max-Age=0${
      isProduction ? `; Domain=${domain}` : ""
    }; Path=/`
  ); // Requires the same options as when created the cookie
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
