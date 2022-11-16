const User = require('../models/userModel')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    register,
    signin,
    loginRequired,
    profile,

} = require('../controllers/userController');

const { v4: uuidv4 } = require('uuid');

// todoList Routes
router.route('/profile')
    .post( loginRequired, profile);
router.route('/auth/register')
    .post(register);
router.route('/auth/signin')
    .post(signin);


// router.use(express.json());

// //Post New User
// router.post('/', createUser)

// // //Get All Users
router.get('/', getUsers);

// // //Get User By ID
router.get('/:id', getUser);

router.delete('/:id', deleteUser)

router.patch('/:id', updateUser)

//Post new Playlist
router.post('/:id/playlist', async (req, res) => {

    const { id } = req.params
    const newPlaylist = {
        // playlistId: uuidv4(), 
        playlistName: req.body.playlistName,
        description: req.body.description,
        // timestamp: Date.now(),
        songsData: []
    }
    User.findOneAndUpdate(
        { _id: id },
        { $push: { savedPlaylists: newPlaylist } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });
    // console.log(user.select())
    const data = await User.findOne({ _id: id })
    res.status(201).json(data.savedPlaylists)
})

//Post New Song Given Playlist ID
router.post('/:userId/:playlistId', async (req, res) => {
    const { userId } = req.params
    const { playlistId } = req.params
    const newSongData = { ...req.body }
    // const parsedData = JSON.parse(data)
    const selectedUser = await User.findOne({ _id: userId });
    const playlists = [...selectedUser.toObject().savedPlaylists]
    const updatePlaylists = playlists.map(playlist => {
        if (playlist._id.toString() === playlistId) {
            playlist.songsData === undefined ? playlist.songsData = [newSongData] : playlist.songsData.push(newSongData)
        }
        return playlist
    });
    console.log(updatePlaylists);
    const update = await User.updateOne({ _id: userId }, { savedPlaylists: updatePlaylists });
    res.status(201).json(update)
})
//Get Playlist Data
router.get('/:userId/:playlistId', async (req, res) => {
    const { userId } = req.params
    const { playlistId } = req.params
    // const parsedData = JSON.parse(data)
    const selectedUser = await User.findOne({ _id: userId });
    const playlists = [...selectedUser.toObject().savedPlaylists]
    const findPlaylist = playlists.find((playlist) => playlist._id.toString() === playlistId)

    // const update = await User.updateOne({_id: userId}, {savedPlaylists: updatePlaylists});
    res.status(201).json(findPlaylist)
})

//Delete Whole Playlist Given ID Params
router.delete('/:userId/:playlistId', async (req, res) => {
    const { userId } = req.params
    const { playlistId } = req.params
    // const newSongData = {...req.body}
    // const parsedData = JSON.parse(data)
    const selectedUser = await User.findOne({ _id: userId });
    const playlists = [...selectedUser.toObject().savedPlaylists]
    // const selectedPlaylist= playlists._id.find((id)=> id)
    const findPlaylist = playlists.find((playlist) => playlist._id.toString() === playlistId)
    console.log(playlists.indexOf(findPlaylist))
    const updatePlaylists = playlists.splice(playlists.indexOf(findPlaylist), 1)
    // console.log(updatePlaylists);
    const update = await User.updateOne({ _id: userId }, { savedPlaylists: playlists });
    // res.status(201).json(updatePlaylists)

    const data = await User.findOne({ _id: userId })
    res.status(201).json(data.savedPlaylists)
})

//delete song from playlist 
router.delete('/:userId/:playlistId/:songId', async (req, res) => {
    const { userId } = req.params
    const { playlistId } = req.params
    const { songId } = req.params
    // const newSongData = {...req.body}
    // const parsedData = JSON.parse(data)
    const selectedUser = await User.findOne({ _id: userId });
    const playlists = [...selectedUser.toObject().savedPlaylists]
    // const selectedPlaylist= playlists._id.find((id)=> id)
    const findPlaylist = playlists.find((playlist) => playlist._id.toString() === playlistId)
    const findSong = findPlaylist.songsData.find((song) => song.key === songId)
    console.log(findPlaylist.songsData[0].key)
    // console.log(playlists.indexOf(findSong))
    console.log(findSong.key.toString())
    // console.log(findPlaylist.songsData)
    const updateSongsData = findPlaylist.songsData.splice(findPlaylist.songsData.indexOf(findSong), 1)
    // console.log(updateSongsData);
    const update = await User.updateOne({ _id: userId }, { savedPlaylists: playlists });
    res.status(201).json(updateSongsData)
})



module.exports = router

