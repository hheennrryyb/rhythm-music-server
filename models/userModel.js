const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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
    username:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
      },
      hash_password: {
        type: String
      },
      created: {
        type: Date,
        default: Date.now
      },
    savedPlaylists: [PlaylistSchema]
}, {timestamps:true})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
  };

module.exports = mongoose.model('User', UserSchema)
// module.exports = mongoose.model('Playlist', PlaylistSchema)