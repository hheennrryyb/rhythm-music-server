const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const register = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    const newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (err, user) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        user.hash_password = undefined;
        return res.json(user);
      }
    });
  } else {
    return res.status(400).json({ message: "Username already taken" })
  }
}

const signin = (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, username: user.username, _id: user._id }, 'RESTFULAPIs') });
  });
};

const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

const profile = (req, res, next) => {
  if (req.user) {
    res.send(req.user);
    next();
  }
  else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

//Get All Users
const getUsers = async (req, res) => {
  const users = await User.find({ ...User })
  res.status(200).json(users)
}

// //Get Single User
// const getUser = async(req, res) =>{
//     const {id} = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json({error:"Invalid User ID"})
//     }
//     // const user = await User.findById(id)
//     const user = await User.findOne({ _id: id }).populate('savedPlaylists')
//     if(!user){
//         return res.status(404).json({error:"User Not Found"})
//     }

//     res.status(200).json(user)
// }

// // Create User
// const createUser = async (req, res) => {
//     const {username} = req.body
//             try{
//                 const user = await User.create({username})
//                 res.status(201).json(user)
//             } catch (error){
//                 res.status(400).json({error:error.message})
//             }
//     }

//Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid User ID" })
  }
  const user = await User.findOneAndDelete({ _id: id })
  if (!user) {
    return res.status(400).json({ error: "User Not Found" })
  }
  res.status(200).json(user)
}

const updateUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid User ID" })
  }
  const user = await User.findOneAndUpdate({ _id: id }, { ...req.body })
  if (!user) {
    return res.status(400).json({ error: "User Not Found" })
  }
  res.status(200).json(user)
}


module.exports = {
  // createUser,
  // getUser,
  getUsers,
  deleteUser,
  updateUser,
  register,
  signin,
  loginRequired,
  profile,
}