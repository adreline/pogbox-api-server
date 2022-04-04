import {queryDatabase as query} from "./utils.js"

const ops = {
  dht1_single: "SELECT id,temperature,humidity,time_stamp FROM DHT ORDER BY id DESC LIMIT 1;",
  dht2_single: "SELECT id,temperature,humidity,time_stamp FROM DHT2 ORDER BY id DESC LIMIT 1;",
  dst_single: "SELECT id,temperature,time_stamp FROM DST ORDER BY id DESC LIMIT 1;"
}


export function readDht1(callback){
  query(ops.dht1_single,(res)=>{
    callback(res)
  })
}
export function readDht2(callback){
  query(ops.dht2_single,(res)=>{
    callback(res)
  })
}
export function readDst(callback){
  query(ops.dst_single,(res)=>{
    callback(res)
  })
}
