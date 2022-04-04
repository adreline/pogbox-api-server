import mysql from "mysql"
import child_process from "child_process"

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
    if (err){
      console.log('DB Error')
      callback("")
    }else {
        console.log("Connected!")
        con.query(query, (err, result)=>{
          if (err) {
            console.log('DB Error')
            callback("")
          }else {
            console.log("Results fetched ")
            con.end()
            callback(result)
          }
      })
    }

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

export function lastArrayItem(array){
  if (array.length!='undefined') {
    return array[array.length - 1]
  }else {
    return "undefined"
  }
}
