var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

// router.get('/statistics-line', function(req, res) {
//   var getMonth= [], getFreq = [], temp_Freq, temp_Freq_Gen, temp_Month, row= [["Gender", "Freq"]];
//     req.getConnection(function(error, conn) {
//     con.query('select * from student', function (err, rows, fields){
//       if (err) {
//         console.log(err);
//       } else {
//         for (var i = 0; i < rows.length; i++ ) {
//           if (rows[i].month == 1) {
//             getMonth.push ("JANUARY");  
//           } else if (rows[i].month == 2 ) {
//             getMonth.push ("FEBRUARY");  
//           } else if (rows[i].month == 3 ) {
//             getMonth.push ("MARCH");
//           } else if (rows[i].month == 4 ) { 
//             getMonth.push ("APRIL");  
//           } else if (rows[i].month == 5 ) {
//             getMonth.push ("MAY");  
//           } else if (rows[i].month == 6 ) { 
//             getMonth.push ("JUNE");    
//           } else if (rows[i].month == 7 ) {  
//             getMonth.push ("JULY");  
//           } else if (rows[i].month == 8 ) {   
//             getMonth.push ("AUGUST");
//           } else if (rows[i].month == 9 ) {   
//             getMonth.push ("SEPETEMBER"); 
//           } else if (rows[i].month == 10 ) {    
//             getMonth.push ("OCTOBER"); 
//           } else if (rows[i].month == 11 ) {    
//             getMonth.push ("NOVEMBER"); 
//           } else if (rows[i].month == 12 ) {    
//             getMonth.push ("DECEMBER");   
//           }
//           getFreq.push(rows[i].Freq)
//         }
//       console.log(getMonth);
//       console.log(getFreq);
//       temp_Freq = JSON.stringify(getFreq);
//       temp_Month = JSON.stringify(getMonth);   
//       res.render('statistics-line.pug'); 
//       }
//     })
//   })
// });
  

module.exports = router;