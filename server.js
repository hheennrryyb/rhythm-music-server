require('dotenv').config({ path: './config.env' });

const users = require('./routes/users')
const charts = require('./routes/charts')

const express = require('express')
const app = express()

const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json({limit: '1000kb'}));
app.use(bodyParser.text({limit: '1000kb'}));
app.use(bodyParser.raw({limit: '1000kb'}));
app.use(bodyParser.urlencoded({limit: '1000kb', extended: true}));

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/users', users);
app.use('/charts', charts);


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


