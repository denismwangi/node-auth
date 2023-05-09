const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({path: './dotenv'});
const app = express();

//db connection
const db = mysql.createConnection({
    // host: process.env.DATABASE_HOST,
    // user: process.env.DATABASE_USER,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node-auth'

});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');

db.connect((error) =>{
    if(error){
        console.log(error);
    }else{
        console.log("database connected...");
    }
})
//Define routes
app.use('/', require('./routes/pages'));

app.listen(5000, () =>{
    console.log("Server started on port 5000");
});