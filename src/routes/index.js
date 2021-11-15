const express = require("express");
const {urlencoded} = require("body-parser");
const estrategia = require('../estrategia-de-autenticacao')

const usuariosRoutes = require('./usuariosRoutes');
const postsRoutes = require('./postsRoutes');



module.exports = app => {
 app.use(urlencoded({extended: true}));
 app.use(express.json());

 app.use(usuariosRoutes);
 app.use(postsRoutes);

}