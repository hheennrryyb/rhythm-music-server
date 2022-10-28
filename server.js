const express = require('express')
const app = express()
const users = require('./routes/users')
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));

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

app.use(cors());

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('API')
})

app.listen(8080, () => {
    console.log("App Is Running On:", 8080)
});