const User = require('../models/userModel')
const mongoose = require('mongoose')

//Get All Users
const getUsers = async (req, res) =>{
    const users = await User.find({...User})
    res.status(200).json(users)
}

//Get Single User
const getUser = async(req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid User ID"})
    }
    // const user = await User.findById(id)
    const user = await User.findOne({ _id: id }).populate('savedPlaylists')
    if(!user){
        return res.status(404).json({error:"User Not Found"})
    }

    res.status(200).json(user)
}

// Create User
const createUser = async (req, res) => {
    const {userName} = req.body
            try{
                const user = await User.create({userName})
                res.status(201).json(user)
            } catch (error){
                res.status(400).json({error:error.message})
            }
    }

//Delete User
const deleteUser = async (req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid User ID"})
    }
    const user = await User.findOneAndDelete({_id: id})
    if(!user){
        return res.status(400).json({error:"User Not Found"})
    }
    res.status(200).json(user)
}

const updateUser = async (req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid User ID"})
    }
    const user = await User.findOneAndUpdate({_id: id}, {...req.body})
    if(!user){
        return res.status(400).json({error:"User Not Found"})
    }
    res.status(200).json(user)
}


module.exports ={
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
}