const SECRET = "asdfghjkl";
const UserModel = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signupController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide correct username and password",
      });
    } else {
      const ifExist = await UserModel.findOne({ username });
      if (ifExist) {
        res.status(401).json({
          success: false,
          message: "Username is already taken",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
          username,
          password: hashedPassword,
        });
        if (newUser) {
          res.status(201).json({
            success: true,
            message: "new user is created.",
          });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const signinController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide correct username and password",
      });
    }

    const ifUser = await UserModel.findOne({ username });
    if (!ifUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, ifUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct",
      });
    }
    const token = jwt.sign({ id: ifUser._id }, SECRET, { expiresIn: "2h" });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true, //only server an manipulate
    };

    if (ifUser.token.length < 2) {
      ifUser.token.push(token);
      await ifUser.save();
      return res.status(200).cookie("token", token, options).json({
        success: true,
        message: "User login successfully",
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "2 device login limit exceeded.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

const dashboardController = async (req, res) => {
  try {
    const userData = await UserModel.findById(req.userId.id).select("token");
    if (!userData) {
      return res.status(403).json({
        success: false,
        message: "No data found",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: userData,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSessionController = async (req, res) => {
  try {
    const { choice } = req.params;
    const { token } = req.cookies;
    const id = req.userId.id;
    const userData = await UserModel.findById(id);
    if (!userData) {
      return res.status(403).json({
        success: false,
        message: "No data found",
      });
    } else {
      if (choice === 1) {
        userData.token = userData.token.filter((i) => i == token);
        await userData.save();
        return res.status(200).json({
          success: true,
          message: userData,
        });
      } else {
        userData.token = userData.token.filter((i) => i != token);
        await userData.save();
        return res.status(200).json({
          success: true,
          message: userData,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  signupController,
  signinController,
  dashboardController,
  deleteSessionController,
};
