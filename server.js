require('dotenv').config({ path: './config.env' });

const users = require('./routes/users')
const charts = require('./routes/charts')
const sharePlaylist = require('./routes/sharePlaylist')

const express = require('express')
const app = express()

const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const jsonwebtoken = require("jsonwebtoken");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json({limit: '1000kb'}));
app.use(bodyParser.text({limit: '1000kb'}));
app.use(bodyParser.raw({limit: '1000kb'}));
app.use(bodyParser.urlencoded({limit: '1000kb', extended: true}));

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      
      req.user = undefined;
      next();
    }
  });
  

app.use((req, res, next) => {
    console.log(`Incoming Request ${req.originalUrl}`)
    next();
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
    res.send('Rhythm API')
})

app.use('/users', users);
app.use('/charts', charts);
app.use('/sharePlaylist', sharePlaylist);




