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

var searchedCity;
var lat;
var lon;
var today = moment().format('(M/D/YYYY)');

var requestUrlGeo= "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=266918c8637e87badd2e272562101ade";

function getWeather(city){
    $.ajax({                                    
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=266918c8637e87badd2e272562101ade",
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
            $('#wSpeed').text(" Wind Speed: " + data.current.wind_speed + " MPH");
            $('#UV').text(data.current.uvi);
            $('#UV').removeAttr('class');
            if(data.current.uvi < 3){
                $('#UV').addClass('favorable rounded custom-display');
            }
            else if(data.current.uvi >= 3 && data.current.uvi < 6){
                $('#UV').addClass('low rounded custom-display');
            }
            else if(data.current.uvi >= 6 && data.current.uvi < 8){
                $('#UV').addClass('moderate rounded custom-display');
            }
            else if(data.current.uvi >= 8 && data.current.uvi < 11){
                $('#UV').addClass('severe rounded custom-display');
            }
            else if(data.current.uvi >= 11){
                $('#UV').addClass('extreme rounded custom-display');
            }
            $('#fiveDay').empty();                  // empties out previous 5-day forecast from previous searches
            for(var i=0; i<5; i++){                // I'm using a template literal to make a whole bunch of HTML at once to generate the 5 day forecast with a for loop
                $('#fiveDay').append(`
                <div class="col-2" style="width: 14rem;">
                    <div class="card bg-info p-2 text-white">
                        <p>${moment().add(i+1, 'days').format('(M/D/YYYY)')}</p>
                        <img src="${"http://openweathermap.org/img/wn/"+ data.daily[i].weather[0].icon +"@2x.png"}">
                        <p>Temp: ${data.daily[i].temp.day} &#176;F</p>
                        <p>Humidity: ${data.daily[i].humidity}%</p>
                    </div>
                </div>
                `)
            }
        });
    });   
};

$('#search-results').on('click', '.btn-outline-secondary', function(event){
    console.log("did I get here");
    searchedCity = $(this).val();
    getWeather(searchedCity);
});

$('#searchBtn').on('click', function(event){
    event.preventDefault();
    searchedCity = $(this).siblings('#cityName').val()
    getWeather(searchedCity);
    var newBtn = $('<button>').text(searchedCity);
    newBtn.attr('value', searchedCity);
    newBtn.attr('class', 'btn btn-outline-secondary m-1');
    $('#search-results').append(newBtn);
});