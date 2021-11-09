const express = require("express")
const {urlencoded} = require("body-parser")

const usuariosRoutes = require('./usuariosRoutes')

module.exports = app => {
 app.use(urlencoded({extended: true}))
 app.use(express.json())

 app.use(usuariosRoutes)

}