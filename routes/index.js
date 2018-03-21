const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const con               = require('../routes/dbconfig');
const expressValidator  = require('express-validator');
const flash             = require('connect-flash');
const crypto            = require('crypto');
const passport          = require('passport');
const passportLocal     = require('passport-local').Strategy;
const async             = require('async');
const moment            = require('moment');
const session           = require('express-session');
const Store             = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(session);
const router            = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   conn.connect(function(err) {
     if (err) throw err;
     console.log("Connected!");
   });
  
   res.send('express');    
 });

router.get('/input', function (req, res) {
    res.render('input');
});

 //write student details
router.post('/input', function (req, res) {
  // this is where you handle the POST request.
  //if (dobval == true)
  var createStudent = {
   student_id: req.body.student_id,
   first_name: req.body.first_name,
   middle_name: req.body.middle_name,
   last_name: req.body.last_name,
   gender: req.body.radio,
   place_of_birth: req.body.place_of_birth,
   date_of_birth: req.body.date_of_birth,
   phone_number: req.body.phone_number,
   email_address: req.body.email_address,
   date_time: req.body.date_time
  }
  console.log(createStudent);
  
  con.query('INSERT INTO student SET ?', createStudent, function (error, results, fields) {
    if (error) throw error;
    console.log("1 record inserted");
		res.redirect('/students');
  });
})

router.get('/students/:id', function(req, res) {
	con.query('SELECT * FROM student WHERE student_id = ?', [req.params.id], function(err, rows, fields) {
		if(err) throw err
    else console.log(rows);
		
		// if user not found
		if (rows.length <= 0) {
				// req.flash('error', 'Student not found with id = ' + req.params.id)
				res.redirect('/students')
		}
		else { // if user found
				// render to views/index.pug template file
				res.render('edit', {
            title: 'Edit Student', 
            student_id: rows[0].student_id,
				    first_name: rows[0].first_name,
				    middle_name: rows[0].middle_name,
            last_name: rows[0].last_name,
            gender: rows[0].gender,
				    place_of_birth: rows[0].place_of_birth,
            date_of_birth: formatDateTime(rows[0].date_of_birth),
            phone_number: rows[0].phone_number,
            email_address: rows[0].email_address,
            date_time: formatDateTime(rows[0].date_time),
            sOldId: rows[0].student_id
        })
		}            
	});
});

router.post('/updated-student', function(req, res) {
  var student_id = req.body.student_id;
  var first_name = req.body.first_name;
  var middle_name = req.body.middle_name;
  var last_name = req.body.last_name;
  var gender= req.body.radio;
  var place_of_birth = req.body.place_of_birth;
  var date_of_birth = req.body.date_of_birth;
  var phone_number = req.body.phone_number;
  var email_address = req.body.email_address;
  var date_time = req.body.date_time;
  var studentOldId = req.body.oldId;
  console.log(student_id+' '+first_name+' '+middle_name+' '+last_name+' '+gender+' '+place_of_birth+' '+date_of_birth+' '+phone_number+' '+email_address +' '+date_time+' '+studentOldId);
  var postData  = {student_id: student_id, first_name: first_name, middle_name: middle_name, last_name: last_name, gender: gender, date_of_birth: date_of_birth, phone_number: phone_number, date_time:date_time, email_address: email_address};

  if(studentOldId !== undefined && studentOldId !== '') {
      con.query('UPDATE student SET student_id = ?, first_name = ?, middle_name = ?, last_name = ?, gender = ? ,place_of_birth = ?, date_of_birth = ?, phone_number = ?, email_address = ?, date_time = ? WHERE student_id = ?', [student_id, first_name, middle_name, last_name, gender, place_of_birth, date_of_birth, phone_number, email_address, date_time, studentOldId], function (error, results, fields) {
          if (error) throw error;
          res.redirect('/students');
      });
  } else {
      con.query('INSERT INTO student SET ?', postData, function (error, results, fields) {
          if (error) throw error;
          res.redirect('/students');
      });
  }
});

router.post('/delete/:id', function (req, res) { 
    con.query('DELETE FROM student WHERE student_id = ?', [req.params.id], function(err, result) {
      if(err) throw err
      res.redirect('/students');
    });
  });

  function transpose(original) {
    var copy = [];
    for (var i = 0; i < original.length; ++i) {
        for (var j = 0; j < original[i].length; ++j) {
            // skip undefined values to preserve sparse array
            if (original[i][j] === undefined) continue;
            // create row if it doesn't exist yet
            if (copy[j] === undefined) copy[j] = [];
            // swap the x and y coords for the copy
            copy[j][i] = original[i][j];
        }
    }
    return copy;
    }
  
  router.get('/students/statistics/:year', function(req, res)  {
    var getMonth = []; getFreq = []; month = []; freq = [] ; temp_MonthFreq=[]; trans_month=[]; getGender = []; getFreqGen = []; temp_genderFreq=[]; trans_gend=[];
    getMonth.push('month', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');
    getFreq.push('freq', 0,0,0,0,0,0,0,0,0,0,0,0);
    con.query('SELECT month(date_time) as month, count(*) as freq FROM student WHERE year(date_time)='+[req.params.year]+' group by month(date_time)', function(err, rows, fields) {
      console.log(rows);
      if (err) {
          console.log(err);
        } else {
          // getFreq.push('freq')
          for (var j = 0 ; j < rows.length ; j++) {
            var month = rows[j].month;
            getFreq.fill(rows[j].freq, month, month+1);       
          }
          temp_MonthFreq.push(getMonth,getFreq)
        }
        var trans_month = transpose(temp_MonthFreq);  
        console.log(trans_month);
  
      con.query('select * from freq_gen', function(err, rows, fields) {
        if (err) {
          console.log(err)
        } else {
          getGender.push('gender')
          getFreqGen.push('freq_gender')
          for (var j = 0 ; j < rows.length ; j++) {
            if (rows[j].gender === 'F') {
              getGender.push('F')
            } else {
              getGender.push('M')
            }
            getFreqGen.push(rows[j].freq_gender)       
          }
          temp_genderFreq.push(getGender,getFreqGen)
        }
        var trans_gend = transpose(temp_genderFreq);  
        console.log(trans_gend);
        res.render('statistics',{obj1: JSON.stringify(trans_month), obj2: JSON.stringify(trans_gend)});
      })  
    })  
  });  
 
module.exports = router;
