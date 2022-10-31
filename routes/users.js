const User = require('../models/userModel')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
} = require('../controllers/userController');

const { v4: uuidv4 } = require('uuid');


// router.use(express.json());

// //Post New User
router.post('/', createUser)

// // //Get All Users
router.get('/', getUsers);

// // //Get User By ID
router.get('/:id', getUser);

router.delete('/:id', deleteUser)

router.patch('/:id', updateUser)

router.post('/:id/playlist', async (req, res) => {
    // const { userName } = req.body
    const {id} = req.params
    const newPlaylist = {
        // playlistId: uuidv4(), 
        playlistName: req.body.playlistName,
        description: req.body.description,
        // timestamp: Date.now(),
        songsData: []
    }
    User.findOneAndUpdate(
        { _id: id }, 
        { $push: { savedPlaylists: newPlaylist  } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
         });
     
        res.status(201).json(newPlaylist)
})

router.post('/:userId/:playlistId', async (req, res) => {
    const {userId} = req.params
    const {playlistId} = req.params
    const newSongData = {...req.body}
            // const parsedData = JSON.parse(data)
        const selectedUser = await User.findOne({ _id: userId });
        const playlists = [...selectedUser.toObject().savedPlaylists]
        const updatePlaylists = playlists.map(playlist => {
            if (playlist._id.toString() === playlistId) {
                playlist.songsData === undefined? playlist.songsData = [newSongData] : playlist.songsData.push(newSongData)
            }
            return playlist
        });
        console.log(updatePlaylists);
        const update = await User.updateOne({_id: userId}, {savedPlaylists: updatePlaylists});
            res.status(201).json(update)
})

module.exports = router

