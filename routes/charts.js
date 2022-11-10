const ChartsByGenre = require('../models/chartsModel')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//Get all Charts List
router.get('/', async (req, res) => {
    const chartsGenre = await ChartsByGenre.find({ ...ChartsByGenre })
    res.status(200).json(chartsGenre)
});
//Get List by genre eg'POP'
router.get('/:genre', async(req, res) =>{
    const {genre} = req.params

    const data = await ChartsByGenre.findOne({ genre: genre }).populate('chartGenreData')
    if(!data){
        return res.status(404).json({error:"Not Found"})
    }

    res.status(200).json(data.chartGenreData)
});
//create Genre
router.post('/', async (req, res) => {
    const { genre } = req.body
    try {
        const chartsGenre = await ChartsByGenre.create({ genre })
        res.status(201).json(chartsGenre)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
//post data to Genre 
router.post('/:id/data', async (req, res) => {

    const { id } = req.params
    const newChartData = req.body
    ChartsByGenre.findOneAndUpdate(
        { _id: id },
        { $set: { chartGenreData: newChartData } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });

    res.status(201).json(newChartData)
})

module.exports = router;