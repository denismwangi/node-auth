const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
const cookies = require("cookie-parser");

dotenv.config({path: './dotenv'});
const app = express();

app.use(cookies());

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//Parse url-encoded bodies (as sent by html forms)
app.use(express.urlencoded({extended: false}));
//parse JSON bodies (as sent by api client)
app.use(express.json());
app.set('view engine', 'hbs');


//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/auth'));

app.listen(5000, () =>{
    console.log("Server started on port 5000");
});