const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const process = require('process');
const path = require('path');
const router = express.Router();
const mysql = require('mysql');
const PORT = process.env.SERVER_PORT || 3000;
require('dotenv').config();

app.use('/', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // configure template engine

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

connection.connect(function(err) {
    if (err) throw err;
});


router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/create', (req, res) => {
    const studentDetails = req.body;
    const sql = 'INSERT INTO students SET ?';
    connection.query(sql, studentDetails, (err) => { 
        if (err) throw err;
        console.log("Student data is inserted successfully "); 
    });
    res.redirect('/');
});

app.get('/view', (req, res) => {
    const studentFn = req.query.fn;
    const sql = `SELECT * FROM students WHERE fn=${studentFn}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/delete', (req,res) => {
    const studentFN = req.body.fn;
    const sql = `DELETE FROM students WHERE fn=${studentFN}`;
    connection.query(sql, (err, result) =>{
        if (err) throw err;
        console.log('deleted');
    });
});

app.get('/list', (req,res) => {
    const { sort } = req.query;
    let sql = "SELECT * FROM students";
    if (sort) {
        sql = `${sql} ORDER BY name ${sort}`;
    }
    connection.query(sql, (err, result) =>{
        if (err) throw err;
        res.json(result);
    });
});

// app.get('/insertintotable', () => {
//     const sql = "INSERT INTO students (name, fn) VALUES ('Ivan', '141234')";
//     connection.query(sql, (err, result) => {
//         console.log(result);
//     })
// })


app.listen(PORT, () => {
    console.log(`Running at ${PORT}`)
});