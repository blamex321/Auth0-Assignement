const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const https = require('https');

router.get('/', function (req, res) {
    if(req.oidc.isAuthenticated()){
        res.render('index',{
            name:req.oidc.user
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/:cityName",function(req,res){
    let city = "";
    city = req.params.cityName;
    if(city === "new-york"){
        city = "new york city";
    };
    const apiKey = process.env.APIKEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q= " + city + " &units=metric";
    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            const dateOBJ = (new Date(weatherData.dt*1000+(weatherData.timezone*1000)));
            const date = dateOBJ.getDate();
            const month = dateOBJ.getMonth() + 1 ;
            const year = dateOBJ.getFullYear();

            const dateString = date + "/" + month + "/" + year;

            // console.log(dateString)
            const r = "1h";
            const weatherOBJ = {
                temp : weatherData.main.temp,
                humidity : weatherData.main.humidity,
                wind : weatherData.wind.speed,
                rain : weatherData.rain['1h'],
                date : dateString
            }
            res.render("weather",{currWeather : weatherOBJ});
        });
    });

});
module.exports = router;