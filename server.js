const express = require("express");
const app = express();
const fs = require('fs')
const path = require('path');
const router = require('./router');
const session = require('express-session');
const redis = require('redis')
const RedisStore = require("connect-redis").default
const flash = require('connect-flash')

let redisClient = redis.createClient()
redisClient.connect(console.error)
redisClient.on('connect', () => console.log('Successfully connect to redis'))
const redisStore = new RedisStore(
  {
    client:redisClient,
  }
)

const middlewareFunc = (req,res,next) => {
     if ( req.query.type == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = "/logout";
    }       
    next(); 
}

// static file
app.use(express.static(__dirname + '/public'));
app.use("/css",express.static(__dirname + 'public/css'))
app.use("/img",express.static(__dirname + 'public/img'))
app.use("/js",express.static(__dirname + 'public/js'))
app.use(express.urlencoded({extended:false}))
// set views 

// Set View's
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
  store:redisStore,
  secret:"prima-komsity-jaya",
  resave:false,
  saveUninitialized:false}
))

app.use(middlewareFunc)
app.use(router)
app.use((req,res) => {
    res.render("404")
})

app.listen(5000, () => {
  console.log("Application started and Listening on port 5000");
});

