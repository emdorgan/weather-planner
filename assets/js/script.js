// When user clicks on the search button <--------- Pseudocode
// The value of the input box is stored in a variable called searchedCity
// searchedCity is added to a url to get the geocode data of the city
// When we get the response, the latitude and longitude are stored in 2 variables: lati and long
// The variables lat and long are placed into a url to make an API call for current weather
// Go through the returned object weather, get the data for the date, weather (sunny, cloudy etc) humidity, wind speed and UV index
// Store each of those in dateData, weatherData, humidityData, wSpeedData UVData
// Populate the main panel with the that data using the jQuery ID selectors
// For each panel on the 5-day forecast, load data for that panel (this step needs more details once I figure out what the weather API object looks like)
// If there are fewer than 8 buttons, then
// Generate a button on the aside panel using jquery button API with a name of SearchedCity and a value of SearchedCity

// When user clicks on the generated button, set searchedCity to the value of the generated button and repeat step 3

var searchedCity = "san francisco";
var lat;
var lon;

var requestUrlGeo= "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=266918c8637e87badd2e272562101ade";

function getGeoResults(city){
    $.ajax({                                    
        url: requestUrlGeo,
        method: 'GET',
    }).then(function (response) {
        
        lat = response.coord.lat;
        lon = response.coord.lon;
        // console.log(lat, lon);
        var requestUrlWeather= "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=266918c8637e87badd2e272562101ade&units=imperial";
        $.ajax({
            url: requestUrlWeather,
            method: 'GET',
        }).then(function (data){
            console.log(data);
            
        });
    });   
};

var requestUrlWeather;

getGeoResults(searchedCity);

