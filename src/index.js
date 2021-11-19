require('dotenv').config();

const express = require('express');
const routes = require('../src/routes');

//Inicialização Redis
require('../redis/blocklist-access-token');
require('../redis/allowlist-refresh-token');

const app = express();
routes(app);


app.listen(3939, ()=> {console.log("api run on port 3939")});

