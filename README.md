# City Explorer

**Author**: Mousa Sabah
**Version**: 4.0.0 

## Overview
An express server which connected with three API server to get the location , weather and parks for a city in [City Explorer](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/) website 

Heroku Link for the server is [here](https://cityexplorer2.herokuapp.com/)


## Getting Started
* Build an express server
* get data from locationIQ API servers,and process the data , then send an object to the front-end website , and storage the data to **database** to reduce the API hitting
* get data from weather API servers for 16 day,and process the forecast data  , then send an array of objects to the front-end website
* get data from Parks API servers,and process, then send an array of objects to the front-end website
* connect to movies API and send array of object to the website
* Hit **YELP** API and git data with using pagination and send the data to front end website

 

## Architecture
build a server using node.js 

express

dotenv

superagent

cors

pg

gitIgnore 

## Change Log

7/4/2021 - add a movie and yelp API and for the yelp i used the pagination 

6/4/2021 - Build a data base to save the locations which client search about it to reduce api hitting 


5/4/2021 5:29pm - Application now has a fully-functional express server, with a GET route for the location and  resource.


4/4/2021 5:59pm - Application now has a fully-functional express server, with a GET route for the location and  resource.




