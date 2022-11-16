const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SharePlaylistSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    playlistName:{
        type: String,
        required: true
    },
    description:String,
    songsData: Array,
    created: {
        type: Date}
})

module.exports = mongoose.model('SharePlaylist', SharePlaylistSchema)