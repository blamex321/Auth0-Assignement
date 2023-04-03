const router = require("express").Router();
const { requiresAuth } = require("express-openid-connect");
const https = require("https");

router.get("/", function (req, res) {
  if (req.oidc.isAuthenticated()) {
    res.render("index", {
      name: req.oidc.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/:cityName",requiresAuth(), function (req, res) {
  let city = "";
  city = req.params.cityName;

  if (city === "new-york") {
    city = "New York";
  }

  const apiKey = process.env.APIKEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?appid=" +
    apiKey +
    "&q=" +
    city +
    " &units=metric";

  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {

      const weatherData = JSON.parse(data);

      const dateOBJ = new Date(
        weatherData.dt * 1000 + weatherData.timezone * 1000
      );
      const time = dateOBJ.toUTCString().substring(17,26);

      const dateString = (dateOBJ.toUTCString().substring(5,16));
      
      let rain = "No Rain";
      if (weatherData.rain) {
        rain = weatherData.rain["1h"] || weatherData.rain["3h"] + "mm";
      }

      const weatherOBJ = {
        temp: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        wind: weatherData.wind.speed,
        rain: rain,
        date: dateString,
        city: weatherData.name,
        time: time
      };
      res.render("weather", { currWeather: weatherOBJ });
    });
  });
});

module.exports = router;