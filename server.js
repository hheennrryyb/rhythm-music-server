require('dotenv').config({ path: './config.env' });

const express = require('express')
const app = express()
const users = require('./routes/users')
const cors = require('cors');
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use((req, res, next) => {
    console.log(`Incoming Request ${req.originalUrl}`)
    next();
});

app.use((req, res, next) => {
    if (
        req.method === 'POST' &&
        req.headers['content-type'] !== 'application/json'
    ) {
        res.send('Please Provide JSON data');
    } else {
        next();
    }
});


app.use('/users', users);

//connect to mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT, () => {
            console.log("App Is Running On:", PORT)
        });
    })
    .catch((err)=>{
        console.log(err)
    })

app.get('/', (req, res) => {
    res.send('API')
})

