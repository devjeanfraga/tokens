require('dotenv').config();
const express = require('express')
const routes = require('../src/routes')

const app = express()
routes(app)


app.listen(3939, ()=> {console.log("api run on port 3939")})

