import {shell_exec} from "./utils.js"

const ops = {
on: "pigs w 21 0",
off: "pigs w 21 1",
state: "pigs r 21"
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
