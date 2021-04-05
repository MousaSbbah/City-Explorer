'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const server = express();
server.use(cors());

const PORT = process.env.PORT || 3333 ;

server.get('/',(req,res)=>{
  res.send('The Server is working')
})

server.get('/location',locationHandler)
server.get('/weather',weatherHandler)
server.get('/parks',parkHandler)


function Location (city,data){
  this.search_query =city;
  this.formatted_query=data.display_name;
  this.latitude=data.lat;
  this.longitude=data.lon;
}

function Weather (data){
  this.forecast =data.weather.description;
  this.time=data.datetime;
}

function Park(data) {
  this.name=data.fullName;
  this.address=`${data.addresses[0].line1}, ${data.addresses[0].stateCode} , ${data.addresses[0].city} (${data.addresses[0].postalCode})`;
  this.fee=data.fees;
  this.description=data.directionsInfo;
  this.url=data.url;
}




function locationHandler(req,res){
  //GET https://eu1.locationiq.com/v1/search.php?key=YOUR_ACCESS_TOKEN&q=SEARCH_STRING&format=json
  let cityName = req.query.city;
  let key = process.env.LOCATION_KEY;
  let locationURL =`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
  superagent.get(locationURL)
    .then(data=>{
      // console.log(data.body[0]);
      let locationData = data.body[0];
      let newLocation = new Location (cityName,locationData);
      res.send(newLocation);
    })
    .catch(error=>{
      res.send(error);
    })
}

function weatherHandler(req,res) {
  let cityName=req.query.search_query;
  let key = process.env.WEATHER_KEY;
  let weatherURL =`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}`;
  //https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
  superagent.get(weatherURL)
    .then(data=>{
      // console.log(data.body.data)
      let weatherObj = data.body;
      let weatherData = weatherObj.data;
      let weatherArr = weatherData.map(val=>{
        let dayWeather = new Weather (val);
        return dayWeather ;
      })
      res.send(weatherArr);
    })

    .catch(error=>{
      res.send(error);
    })

}

function parkHandler(req,res){
  let cityName=req.query.search_query;
  let key = process.env.PARK_KEY;
  let parksURL =`https://developer.nps.gov/api/v1/parks?limit=10&q=${cityName}&api_key=${key}`;
  superagent.get(parksURL)
    .then(data=>{
      console.log(data.body.data);
      let parksData=data.body.data;
      let parksArr = parksData.map(val=>{
        let eachPark = new Park(val);
        return eachPark;
      })
      res.send(parksArr);
    })
    .catch(error=>{
      res.send(error);
    })
}
server.get('*',(req,res)=>{
  let errorObj = {
    status: 500,
    responseText: 'Sorry, something went wrong'
  }

  res.status(500).send(errorObj);


})

server.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`)
});
