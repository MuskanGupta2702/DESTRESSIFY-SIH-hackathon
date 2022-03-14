const mysql = require("mysql");
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'PMmodi$$1',
    database:'destressify'
  });
  connection.connect(function(error){
    if(error){      
      console.log(error);
    }else{
      console.log('Database Connected!:)');
    }
  });  
 module.exports = connection;