const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Please fill all fields a" });
    }
    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(500)
        .send({ success: false, message: "User already registered" });
    }
    //hashed password
    const hashedPassword = await hashPassword(password);

    // Save User
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration Successful, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register API",
    });
  }
};

//login

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "please provide email or password",
      });
    }

    //find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "user not found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "invalid username or password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api in file userController.js",
      error,
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //user find
    const user = await userModel.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is required and should be 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updatedUser
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      }, //{ new: true } option ensures the variable updatedUser now contains the new name.
      { new: true },
    );
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "profile updated.Plz login",
      updatedUser,
    });
  } catch (error) {
    console.log(error); // This prints the full stack trace
    res.status(500).send({
      success: false,
      message: "error in user update api",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
