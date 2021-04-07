'use strict';


function Weather (data){
  this.forecast =data.weather.description;
  this.time=data.datetime;
}

module.exports=Weather;
