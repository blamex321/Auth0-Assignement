const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { auth } = require('express-openid-connect');
const app = express();

app.use(express.static(__dirname+"/public"));



const config = {
    authRequired: false,
    auth0Logout: true
  };

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(port,function(){
    console.log("Server started at 3000");
})