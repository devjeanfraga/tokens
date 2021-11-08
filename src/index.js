const express = require('express')
const {urlencoded}  = require('body-parser')

const app = express()
app.use(urlencoded({extended: true}))
app.use(express.json())


app.listen(3939, ()=> {console.log("api run on port 3939")})