const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
    playlistName:{
        type: String,
        required: true
    },
    description:String,
    songsData: Array
}, {timestamps:true})


const UserSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    savedPlaylists: [PlaylistSchema]
}, {timestamps:true})

module.exports = mongoose.model('User', UserSchema)
// module.exports = mongoose.model('Playlist', PlaylistSchema)