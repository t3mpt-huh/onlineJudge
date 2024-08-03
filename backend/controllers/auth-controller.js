const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// home page
const home = async (req, res) => {
  try {
    res.status(200).send("this is home page :)");
  } catch (error) {
    console.log(error);
  }
};

//register logic
const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create and hash the user password
    const userCreated = new User({
      username,
      email,
      phone,
      password // Password will be hashed in pre('save') hook
    });

    await userCreated.save(); // Save the user to trigger the pre('save') hook

    res.status(201).json({
      msg: "Successfully registered user",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error!");
  }
};


// login logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password });

    const userExist = await User.findOne({ email });
    if (!userExist) {
      console.log('User does not exist');
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log('User found:', userExist);

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log('Password matches');

    const token = jwt.sign(
      {
        userId: userExist._id.toString(),
        email: userExist.email,
        isAdmin: userExist.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      msg: "Login Successful",
      token,
      userId: userExist._id.toString(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json("Internal server error");
  }
};



// send user data to frontend
const user = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`error from the user route ${error}`);
    res.status(500).json("Internal server error");
  }
};

module.exports = { home, register, login, user };
