import {shell_exec, validateTimeTable as validate} from "./utils.js"

const ops = {
on: "pigs w 12 0",
off: "pigs w 12 1",
state: "pigs r 12",
crontab: "crontab -l"
}


export function switchOn(){
  shell_exec(ops.on)
}
export function switchOff(){
  shell_exec(ops.off)
}
export function getState(callback){
  shell_exec(ops.state, (res)=>{
    callback(res)
  })
}
export function getSchedule(callback){
  shell_exec(ops.crontab,(res)=>{
    callback(res)
  })
}
export function setSchedule({h_on,m_on,h_off,m_off}, callback){
  if (validate(h_on,m_on) && validate(h_off,m_off)) {
    let schedule_on = `${m_on} ${h_on} * * * pigs w 12 0`
    let schedule_off = `${m_off} ${h_off} * * * pigs w 12 1`

    //clear crontab for www-data user
  shell_exec("echo \"\" | crontab -",()=>{
    //install new crontab for www-data user
    shell_exec(`(crontab -l 2>/dev/null; echo \"${schedule_on}\") | crontab -`,()=>{
      shell_exec(`(crontab -l 2>/dev/null; echo \"${schedule_off}\") | crontab -`,()=>{
        callback("ok")
      })
    })
  })
  }else {
    callback("Bad data")
  }
}
