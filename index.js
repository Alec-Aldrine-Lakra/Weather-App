'use strict';
const request = require('request');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static('public'));

function convert(temp){
	temp-=32;
	temp*=5;
	temp/=9;
	return temp.toFixed(2);
}

app.get('/',(req,res)=>{
	res.render('index');
})

app.post('/', (req, res)=>{
    let city = req.body.city;
  	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`;
    request({url:url,json:true}, (err, response) => {
    	if(err){
	      res.render('index', {weather: null, error: 'Error, please try again'});
	    }
	    else
	    {
	       let w = response.body;
	       if(w.main == undefined){
	           res.render('index', {weather: null, error: 'Error, please try again'});
	       } 
	       else{
	       		let name = w.name;
	       	    let lat = w.coord.lat;
	       	    let lon = w.coord.lon;
	       		let deg = convert(w.main.temp);
	       		let humidity = w.main.humidity;
	       		let pressure = w.main.pressure;
	       		let description = w.weather[0].description.toUpperCase();
	           	res.render('index', {weather: [name,lon,lat,deg,humidity,pressure,description], error: null});
	       }
	    }
	});
})

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));