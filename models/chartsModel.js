const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ChartsByGenreSchema = new Schema({
    genre:String,
    chartGenreData:Array
})

module.exports = mongoose.model('ChartsByGenre', ChartsByGenreSchema)