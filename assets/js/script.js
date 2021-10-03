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

var searchedCity = "San Francisco";
var lat;
var lon;
var today = moment().format('(M/D/YYYY)');

console.log(today);

var requestUrlGeo= "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=266918c8637e87badd2e272562101ade";

function getGeoResults(city){
    $.ajax({                                    
        url: requestUrlGeo,
        method: 'GET',
    }).then(function (response) {
        
        lat = response.coord.lat;
        lon = response.coord.lon;
        // console.log(lat, lon);
        var requestUrlWeather= "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=266918c8637e87badd2e272562101ade&units=imperial"; // using one-call-API since it gives a 7 day forecast
        $.ajax({
            url: requestUrlWeather,
            method: 'GET',
        }).then(function (data){
            console.log(data);
            var iconUrl = "http://openweathermap.org/img/wn/"+ data.current.weather[0].icon +"@2x.png";
            var weatherIcon = $('<img>').attr('src', iconUrl);
            $('#city-name').text(searchedCity + " " + today);
            $('#city-name').append(weatherIcon);
            $('#temp').html("Temperature: " + data.current.temp + " &#176;F");
            $('#humidity').text("Humidity: " + data.current.humidity + "%");
            $('#wSpeed').text(" Wind Speed: " + data.current.wind_speed + "MPH");
            $('#UV').text(data.current.uvi);
            if(data.current.uvi < 3){
                $('#UV').addClass('favorable');
            }
            else if(data.current.uvi >= 3 && data.current.uvi < 6){
                $('#UV').addClass('low');
            }
            else if(data.current.uvi >= 6 && data.current.uvi < 8){
                $('#UV').addClass('moderate');
            }
            else if(data.current.uvi >= 8 && data.current.uvi < 11){
                $('#UV').addClass('severe');
            }
            else if(data.current.uvi >= 11){
                $('#UV').addClass('extreme');
            }

        });
    });   
};

getGeoResults(searchedCity);

