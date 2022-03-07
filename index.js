var express = require('express');
var request = require('request-promise');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended : true}));

mongoose.connect('mongodb+srv://pranabesh:pranabesh777@weather.fihf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

var citySchema = new mongoose.Schema({
    name : String 
});

var cityModel = mongoose.model('City', citySchema);

//var lasvegas = new cityModel({name : 'Las Vegas'});
//var toronto = new cityModel({name : 'Toronto'});
//var sydney = new cityModel({name : 'Sydney'});
//lasvegas.save()
//toronto.save()
//sydney.save()

async function getWeather(cities) {
    var weather_data = [];

    for (var city_obj of cities) {
        var city = city_obj.name;
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=9029c6c2af6615045667af53bec0e52f`;

        var response_body = await request(url);

        var weather_json = JSON.parse(response_body);

        var weather = {
            city : city,
            temperature : Math.round(weather_json.main.temp),
            description : weather_json.weather[0].description,
            icon : weather_json.weather[0].icon
        };

        weather_data.push(weather);
    }

    return weather_data;
}

//var city = 'Las Vegas';

app.get('/', function(req, res) {

    cityModel.find({}, function(err, cities) {

        getWeather(cities).then(function(results) {

            var weather_data = {weather_data : results};

            res.render('weather', weather_data);

        });

    });      

});

app.post('/', function(req, res) {

    var newCity = new cityModel({name : req.body.city_name});
    newCity.save();

    res.redirect('/');

});

app.listen(8000);