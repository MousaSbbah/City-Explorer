
'use strict';


function Location (city,data){
  this.search_query =city;
  this.formatted_query=data.display_name;
  this.latitude=data.lat;
  this.longitude=data.lon;
}


module.exports=Location;
