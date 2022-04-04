import express from "express"
import bodyParser from "body-parser"
import fs from "fs"
import {lastArrayItem as last} from "./modules/utils.js"
import {readDht1 as dht1, readDht2 as dht2, readDst as dst} from "./modules/sensors.js"
import {switchOn as gr_on, switchOff as gr_off, getState as gr_state, getSchedule, setSchedule} from "./modules/growlight.js"
import {switchOn as ex_on, switchOff as ex_off, getState as ex_state} from "./modules/exhaust.js"
import {getSpaceData, getCpuTemp, getDatabaseSize} from "./modules/system.js"

const root_dir = "/home/ubuntu/servers/pogbox-server/"
const app = express()
app.set('views', './html')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/api/getdst",(req, res)=>{
  dst((reading)=>{
    res.json({temperature: "1", time_stamp: "4353543"}).end()
  })
})
app.get("/api/getdht",(req, res)=>{
  dht1((reading)=>{
    res.json({temperature: "1",humidity: "2" , time_stamp: "4545454"}).end()
  })
})
app.get("/api/getdht2",(req, res)=>{
  dht2((reading)=>{
    res.json({temperature: "1", humidity: "2", time_stamp: "56757"}).end()
  })
})
app.get("/api/growlight",(req, res)=>{
  switch (req.query.switch) {
    case 'on':
      gr_on()
      res.sendStatus(200).end()
    break;
    case 'off':
      gr_off()
      res.sendStatus(200).end()
    break;
    case 'state':
      gr_state((state)=>{
        res.send(state).end()
      })
    break;
    default:
    console.log("/api/growlight has received invalid request")
    console.log(req.query)
    res.sendStatus(500)
    break;
  }
})
app.get("/api/growlight/schedule",(req, res)=>{
  switch (req.query.method) {
    case 'get':
      getSchedule((schedule)=>{
        schedule=schedule.replace("\n",";").replace(/pigs w 12 [1|0]/g,"")
        schedule=schedule.split(";")

        let schedule_on=schedule[0].split(" ")
        let schedule_off=schedule[1].split(" ")

        res.send(`${schedule_on[0]};${schedule_on[1]};${schedule_off[0]};${schedule_off[1]}`).end()
      })
    break;
    case 'set':
      setSchedule({
        h_on: req.query.h_on,
        m_on: req.query.m_on,
        h_off: req.query.h_off,
        m_off: req.query.m_off
      },(response)=>{
        console.log(response)
        if (response!="ok") {
          res.sendStatus(500)
        }else {
          res.sendStatus(200)
        }
      })
    break;
    default:
    console.log("/api/growlight/schedule has received invalid request")
    console.log(req.query)
    res.sendStatus(500)
    break;
  }
})
app.get("/api/exhaust",(req, res)=>{
  switch (req.query.switch) {
    case 'on':
      ex_on()
      res.sendStatus(200).end()
    break;
    case 'off':
      ex_off()
      res.sendStatus(200).end()
    break;
    case 'state':
      ex_state((state)=>{
        res.send(state).end()
      })
    break;
    default:
    console.log("/api/exhaust has received invalid request")
    console.log(req.query)
    res.sendStatus(500)
    break;
  }
})
app.get("/api/system",(req, res)=>{
  //callback hell start
  getSpaceData((space)=>{
    getCpuTemp((cpu_temp)=>{
      getDatabaseSize((db_size)=>{
        res.json({
          space_data: space.split(" "),
          cpu_temp: Number(cpu_temp.replace("°C","")),
          dbdata: Number(db_size)
        }).end()
      })
    })
  })
  //callback hell end
})
app.get("/api/plots/*.svg",(req, res)=>{
  let filename = last(req.url.split("/"))
  if (fs.existsSync(`./cron/PlotFiles/${filename}`)) {
    res.sendFile(`${root_dir}cron/PlotFiles/${filename}`).end()
  }else {
    res.sendStatus(404).end()
  }
})
app.get("/api",(req, res)=>{
  switch (req.query.method) {
    case 'day_average':
      res.json({avt:"1",avh:"1"}).end()
    break
    default:
    res.sendStatus(500).end()
    break
  }

})

app.listen(6969, () => {
    console.log("Server is Running")
})
