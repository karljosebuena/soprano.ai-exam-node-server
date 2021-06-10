const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.checkIfEmailAlreadyRegistered = async (req, res, next) => {
  try {
    const {
      email,
    } = req.body;

    req.user = await User.findOne({ email });
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}


exports.signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;
    const { user } = req;

    // email should only be registered once
    if (user) {
      return res.status(200)
        .json({
          userToken: null,
          registered: false
        })
    }

    const newUser = new User({
      name,
      email,
      password: await User.encryptPassword(password),
      // photo: {
      //   data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      //   contentType: 'image/*'
      // }
    })

    const savedUser = await newUser.save();
    const userToken = jwt.sign({ id: savedUser._id, name: savedUser.name, email: savedUser.email }, process.env.VERY_SECRET_KEY, {
      expiresIn: parseInt(process.env.TOKEN_EXPIRATION, 10)
    })

    res.status(201)
      .json({
        userToken,
        registered: true
      })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.logIn = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) return res.json({
      message: 'User not exists'
    })

    const matchPassword = await User.comparePassword(req.body.password, userExist.password)
    if (!matchPassword) {
      return res.json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign({ id: userExist._id, name: userExist.name, email: userExist.email }, process.env.VERY_SECRET_KEY, {
      expiresIn: parseInt(process.env.TOKEN_EXPIRATION, 10)
    })

    return res.json({
      _id: userExist._id,
      message: 'Login Succesful',
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}