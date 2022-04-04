import mysql from "mysql"
import child_process from "child_process"

export const queries = {
  dht1_single: "SELECT id,temperature,humidity,time_stamp FROM DHT ORDER BY id DESC LIMIT 1;",
  dht2_single: "SELECT id,temperature,humidity,time_stamp FROM DHT2 ORDER BY id DESC LIMIT 1;",
  dst_single: "SELECT id,temperature,time_stamp FROM DST ORDER BY id DESC LIMIT 1;"
}


function getDatabase(){
  return mysql.createConnection({
    host: "localhost",
    database: "growbox_db",
    user: "growbox_user",
    password: "dfc0af598b4"
  })
}

export function queryDatabase(query,callback){
  let con = getDatabase()
  con.connect((err)=>{
    if (err){ throw err}
    console.log("Connected!")
      con.query(query, (err, result)=>{
        if (err) throw err
        console.log("Result: " + result)
        con.end()
        callback(result)
    })
  })
}

export function shell_exec(command, callback=function(){}){
  child_process.exec(command, (err, stdout, stderr)=>{
      if (err) {
        console.log(err.stack)
        console.log('The error message: '+err.code)
        console.log(' the Signal message: '+err.signal)
        callback(0)
      }
        callback(stdout.trim())
      })
}

export function validateTimeTable(h,m){
  h=Number(h)
  m=Number(m)
  if (!isNaN(h) && !isNaN(m)) {
    if ( h>-1 && h<25 && m>-1 && m<61 ) {
      return true;
    }
  }
  return false;
}
