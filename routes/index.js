const express = require('express');
const router = express.Router();
const mysql = require('mysql');

 var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "wonderlabs",
   database: "student_info"
 });

/* GET home page. */
router.get('/', function(req, res, next) {
   con.connect(function(err) {
     if (err) throw err;
     console.log("Connected!");
   });
  
   res.send('express');    
 });
 
module.exports = router;
