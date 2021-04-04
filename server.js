'use strict';

const express = require('express');

require('dotenv').config();
const cors = require('cors');
const server = express();
server.use(cors());
const PORT = process.env.PORT || 3333 ;

server.get('/',(req,res)=>{
  res.send('The Server is working')
})

server.get('/location',(req,res)=>{
  let locationData = require('./data/location.json');
  let newLocation = new Location (locationData[0]);
  res.send(newLocation);
})
server.get('/weather',(req,res)=>{
  let weatherArr=[];
  let weatherObj = require('./data/weather.json');
  let weatherData = weatherObj.data;
  weatherData.forEach(val => {
    let dayWeather = new Weather (val);
    weatherArr.push(dayWeather)
  });

  res.send(weatherArr);
})


function Location (data){
  this.search_query ='Lynnwood';
  this.formatted_query=data.display_name;
  this.latitude=data.lat;
  this.longitude=data.lon;
}
function Weather (data){
  this.forecast =data.weather.description;
  this.time=data.datetime;
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
