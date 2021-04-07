/* eslint-disable new-cap */
'use strict';

const express = require('express');
require('dotenv').config();
const server = express();
const pg = require('pg');
const cors = require('cors');
server.use(cors());
const superagent = require('superagent');
const location = require('./modules/location.js')
const weather = require('./modules/weather.js')


const PORT = process.env.PORT || 3333 ;
const client = new pg.Client({ connectionString: process.env.DATABASE_URL,ssl: { rejectUnauthorized: false }});

server.get('/',(req,res)=>{
  res.send('The Server is working')
})

server.get('/location',locationHandler)
server.get('/weather',weatherHandler)
server.get('/parks',parkHandler)
server.get('/movies',movieHandler)
server.get('/yelp',yelpHandler)

function Park(data) {
  this.name=data.fullName;
  this.address=`${data.addresses[0].line1}, ${data.addresses[0].stateCode} , ${data.addresses[0].city} (${data.addresses[0].postalCode})`;
  this.fee=data.fees;
  this.description=data.directionsInfo;
  this.url=data.url;
}
function Movie(data) {

  this.title=data.original_title;
  this.overview=data.overview;
  this.average_votes=data.vote_average;
  this.total_votes=data.vote_count;
  this.image_url=`https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
  this.popularity=data.popularity;
  this.released_on=data.release_date;

}
function Yelp(data) {
  this.name=data.name;
  this.image_url=data.image_url;
  this.price=data.price;
  this.rating=data.rating;
  this.url=data.url;
}



function locationHandler(req,res){
  let cityName = req.query.city;
  let key = process.env.LOCATION_KEY;
  let locationURL =`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
  let SQL = `SELECT * FROM locations WHERE search_query='${cityName}';`
  client.query(SQL)
    .then(result=>{
      if(result.rows.length===0){

        superagent.get(locationURL)
          .then(data=>{
            let locationData = data.body[0];
            let newLocation = new location (cityName,locationData);
            res.send(newLocation);
            let SQL1 = `INSERT INTO locations VALUES ($1,$2,$3,$4) RETURNING *;`
            let safeValue = [newLocation.search_query,newLocation.formatted_query,newLocation.latitude,newLocation.longitude]
            client.query(SQL1,safeValue)

          })
          .catch(error=>{
            res.send(error);
          })

      }else{
        res.send(result.rows[0]);
      }
    })

}

function weatherHandler(req,res) {
  let cityName=req.query.search_query;
  let key = process.env.WEATHER_KEY;
  let weatherURL =`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}`;
  superagent.get(weatherURL)
    .then(data=>{
      let weatherObj = data.body;
      let weatherData = weatherObj.data;
      let weatherArr = weatherData.map(val=>{
        let dayWeather = new weather (val);
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

function movieHandler(req,res) {
  let resultArr=[];
  let search= req.query.search_query;
  let key = process.env.MOVIES_KEY;
  let moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${search}`
  superagent.get(moviesURL)
    .then(data=>{
      let moviesArr = data.body.results;
      moviesArr.forEach(val=>{
        let newMovie = new Movie (val);
        resultArr.push(newMovie);
      })
      res.send(resultArr);
    })
    .catch(error=>{
      res.send(error);
    })
}

function yelpHandler(req,res) {
  let key = process.env.YELP_KEY;
  let yelpArr=[];
  let pageNum = req.query.page;
  let cityName = req.query.search_query;
  let offsetValue = ((pageNum -1)*5) +1 ;
  let yelpURL = `https://api.yelp.com/v3/businesses/search?location=${cityName}&limit=5&offset=${offsetValue}`
  superagent.get(yelpURL)
    .set('authorization',`Bearer ${key}`)
    .then(data=>{
      let yelpDATA= data.body.businesses;
      yelpDATA.forEach(value=>{
        let newYelp =new Yelp(value);
        yelpArr.push(newYelp);
      })
      res.send(yelpArr);
    })
    .catch(err=>{
      res.send(err);
    })
}

client.connect()
  .then(()=>{

    server.listen(PORT,()=>{
      console.log(`Listening on PORT ${PORT}`);
    })

  })
