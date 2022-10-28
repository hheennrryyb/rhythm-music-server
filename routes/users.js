const express = require('express')
const router = express.Router()
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


router.use(express.json());

function loadData(callback) {
    fs.readFile('./data/userData.json', 'utf8', callback)
}

function saveData(data) {
    fs.writeFile(`./data/userData.json`, data, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

// router.get('/', (req, res) => {
//     res.send('working again')
// })

router.get('/', (req, res) => {
    loadData((err, data) => {
        if (err) {
            res.send('Theres been an error requesting data')
        } else {
            const users = JSON.parse(data)
            res.status(200).json(users);
        }
    })
});

router.get('/:id', (req, res) => {
    loadData((err, data) => {
        if (err) {
            res.send('Theres been an error requesting data')
        } else {
            const users = JSON.parse(data)
            const selectedUser = users.find((user) => user.id == req.params.id)
            res.status(200).json(selectedUser);
        }
    })
});

router.post('/', (req, res) => {

    loadData((err, data) => {
        if (err) {
            res.send('Theres been an error requesting data')
        } else {
            const parsedData = JSON.parse(data)

            const newUser = {
                userId: uuidv4(),
                userName: req.body.userName,
                // channel: req.body.channel,
                // timestamp: Date.now(),
                savedPlaylists: []
            }

            parsedData.push(newUser)
            saveData(JSON.stringify(parsedData))
            res.status(201).send(`User has been added`)
        }
    })
})

router.post('/:userId/playlist', (req, res) => {
    loadData((err, data) => {
        if (err) {
            res.send('Theres been an error requesting data')
        } else {

            const parsedData = JSON.parse(data)
            const selectedUser = parsedData.find((user) => user.userId == req.params.userId)

            const newPlaylist = {
                playlistId: uuidv4(),
                playlistName: req.body.name,
                description: req.body.description,
                timestamp: Date.now(),
                songsData: []
            }
            selectedUser.savedPlaylists.push(newPlaylist)

            saveData(JSON.stringify(parsedData))
            res.status(201).send(newPlaylist);
        }
    })
})

router.post('/:userId/:playlistId', (req, res) => {
    loadData((err, data) => {
        if (err) {
            res.send('Theres been an error requesting data')
        } else {

            const parsedData = JSON.parse(data)
            const selectedUser = parsedData.find((user) => user.userId == req.params.userId)
            
            const selectedPlaylist = selectedUser.savedPlaylists.find((playlist) => playlist.playlistId == req.params.playlistId)

            const newSongData = req.body.song

            selectedPlaylist.songsData.push(newSongData)

            saveData(JSON.stringify(parsedData))
            res.status(201).send(newSongData);
        }
    })
})

module.exports = router

