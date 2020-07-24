const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors =  require('cors');


app.use(bodyParser.json());
require('./database.js');

//permite conectar srevidores
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//routes(app);
app.use('/api',require('./routes/index'));
app.listen(3000);

console.log('Server on port',3000);