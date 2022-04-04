import express from "express"
import bodyParser from "body-parser"

const app = express()
app.set('views', './html')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))
