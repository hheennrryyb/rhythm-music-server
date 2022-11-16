const SharePlaylist = require('../models/sharePlaylistModel')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//Get all SharedPlaylist List
router.get('/', async (req, res) => {
    const chartsGenre = await SharePlaylist.find({ ...SharePlaylist })
    res.status(200).json(chartsGenre)
});
//Get List by genre eg'POP'
router.get('/:id', async(req, res) =>{
    const {id} = req.params

    const data = await SharePlaylist.findOne({ _id: id })
    if(!data){
        return res.status(404).json({error:"Not Found"})
    }

    res.status(200).json(data)
});
//create SharedPlaylist
router.post('/create', async (req, res) => {
    const sharePlaylistData = {
        username: req.body.username,
        playlistName: req.body.playlistName,
        description: req.body.description,
        songsData: req.body.songsData,
        created: req.body.created,
    }
    try {
        const newSharePlaylist = await SharePlaylist.create( sharePlaylistData )
        res.status(201).json(newSharePlaylist)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
//post data  
// router.post('/:id/data', async (req, res) => {

//     const { id } = req.params
//     const newChartData = req.body
//     SharePlaylist.findOneAndUpdate(
//         { _id: id },
//         { $set: { chartGenreData: newChartData } },
//         function (error, success) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(success);
//             }
//         });

//     res.status(201).json(newChartData)
// })

module.exports = router;