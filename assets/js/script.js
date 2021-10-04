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

$(document).ready(function(){       // waits to the document to fully load before doing any jQuery

    var searchedCity;           // Global variable for the searched city
    var lat;                    // it's lattitute   
    var lon;                    // and it's longitute
    var today = moment().format('(M/D/YYYY)');  // today returns the exact date in (MM/D/YYYY) format

    function loadButtons(){                          // Function that loads the previous search buttons from local storage when called
        var pastCities = Object.keys(localStorage);     // declares an array, pastCities, of all keys in local storage
        for(i=0; i < pastCities.length; i++){           // Iteraters through the local storage keys
            if(i<14){                                   // caps the maximum at 14 past search results
                var newBtn = $('<button>').text(pastCities[i]);     //creates a new button with the text is the name of the searched city
                newBtn.attr('value', pastCities[i]);                    // sets the value to be used in an event listener
                newBtn.attr('class', 'btn btn-outline-secondary m-1');  // sets bootstrap css
                $('#search-results').append(newBtn);                    // appends the new button
            }
        }

    }

    function getWeather(city){                                  // major function which gets the weather of the city passed through the arg
        $.ajax({                                                // uses AJAX to make an API request for coordinates of the city entered by the user
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=266918c8637e87badd2e272562101ade",      // puts the city into a Geolocator
            method: 'GET',
        }).then(function (response) {
            lat = response.coord.lat;                                                                   //gets the latitude
            lon = response.coord.lon;                                                                   // and longitude of the searched city
            // console.log(lat, lon);
            var requestUrlWeather= "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=266918c8637e87badd2e272562101ade&units=imperial"; // using one-call-API since it gives a 7 day forecast
            $.ajax({                                                                                    // uses AJAX to get the weather data of that coordinate set
                url: requestUrlWeather,
                method: 'GET',
            }).then(function (data){                                                                    // promise that waits for the data to be recieved
                var iconUrl = "http://openweathermap.org/img/wn/"+ data.current.weather[0].icon +"@2x.png";     //sets the weather icon into a URL provided by open weather
                var weatherIcon = $('<img>').attr('src', iconUrl);                                  // sets src attribute of the image tag for the icon
                $('#city-name').text(searchedCity + " " + today);                                   // sets the searched city name and uses moment.js to get today's date
                $('#city-name').append(weatherIcon);                                                // appends the icon
                $('#temp').html("Temperature: " + data.current.temp + " &#176;F");                  // sets the temp data
                $('#humidity').text("Humidity: " + data.current.humidity + "%");                    // sets the humidity data
                $('#wSpeed').text(" Wind Speed: " + data.current.wind_speed + " MPH");              // sets the wind speed data
                $('#UV').text(data.current.uvi);                                                    // sets the UV index
                $('#UV').removeAttr('class');                                                       // removes any previous styling from past searches
                if(data.current.uvi < 3){                                                       //sets the color of the UV index according to how severe it is (5 different levels)
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
                for(var i=0; i<5; i++){                // I'm using a template literal to make a whole bunch of HTML at once to get a single card, and I'm using a for loop to iterate through and make 5 cards. I use moment().add gets the sequential days (+1 to prevent offByOne error)
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
                localStorage.setItem(searchedCity, searchedCity);   // sets the search result to a key and value (only the key will be used), this is a clever way to prevent dupe results, since the keys have to be unique
                $('#search-results').empty();                       // deletes all previous search result buttons
                loadButtons();                                      // and calls the loadButtons() function to load a new set that includes the city that the user just searched
            });
        });   
    };

    $('#search-results').on('click', '.btn-outline-secondary', function(){         //adds an event listener to the PARENT of the dynamically generated buttons but sets the property so that it's applicable to the generated buttons
        searchedCity = $(this).val();                                                   // sets the value of searched city to whichever button was clicked using the 'this' keyword
        getWeather(searchedCity);
    });

    $('#searchBtn').on('click', function(event){                                        // adds event listener to the search button
        event.preventDefault();                                                         // prevents default behavior
        searchedCity = $(this).siblings('#cityName').val()                              // sets the variable that will be passed into getWeather() to what the user just typed in
        getWeather(searchedCity);                                                       // calls the huge API function with that variable as an argument
    });
    loadButtons();                  // calls the 'loadButtons' function when the browser first loads
});