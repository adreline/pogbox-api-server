import {shell_exec, queryDatabase as query} from "./utils.js"


const ops={
  space_data: "df -h|grep /dev/root|awk '{print $2\" \"$3\" \"$4\" \"$5}'",
  cputemp: "sensors cpu_thermal-virtual-0|grep temp1|awk '{print $2}'|tr -d '+'",
  db_size: "SELECT table_schema \\\"growbox_db\\\",ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) \\\"DB Size in MB\\\" FROM information_schema.tables GROUP BY table_schema;"
}


export function getSpaceData(callback){
  shell_exec(ops.space_data,(res)=>{
    callback(res)
  })
}

export function getCpuTemp(callback){
  shell_exec(ops.cputemp,(res)=>{
    callback(res)
  })
}

export function getDatabaseSize(callback){
  query(ops.db_size,(res)=>{
    callback(res)
  })
}
