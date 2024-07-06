const cityName = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const weatherCard = document.querySelector('.current-weather');
const dailyCard = document.querySelector('.weather-cards');
const API_KEY = '2044da7417aa03fec696fde550e3065f';
const fetchWeather = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        if(result.cod==='404' ){
            alert('City not found.Please enter valid city name/')
        }
        const currentWeather = result.list[0];
        const currentDate = new Date(currentWeather.dt * 1000);
        const currentHumidity = currentWeather.main.humidity;
        const currentTemp = currentWeather.main.temp - 273.15;
        const currentWindSpeed = currentWeather.wind.speed;
        const currentIcon = currentWeather.weather[0].icon;

        weatherCard.innerHTML = `
            <div class="details">
                <h2 class="date">City: ${city} ,  Date: ${currentDate.toLocaleDateString()}</h2>
                <img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" class="image" alt="Weather Icon">
                <h6 class="temperature">Temperature: ${currentTemp.toFixed(2)}°C</h6>
                <h6 class="wind">Wind: ${currentWindSpeed} m/s</h6>
                <h6 class="humidity">Humidity: ${currentHumidity}%</h6>
            </div>
        `;

        let days = {};
        dailyCard.innerHTML = '';
        result.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            if (!days[date]) {
                days[date] = {
                    temps: [],
                    winds: [],
                    humidities: [],
                    icons: []
                };
            }
            days[date].temps.push(forecast.main.temp - 273.15);
            days[date].winds.push(forecast.wind.speed);
            days[date].humidities.push(forecast.main.humidity);
            days[date].icons.push(forecast.weather[0].icon);
        });

        Object.keys(days).slice(0, 5).forEach(date => {
            const temps = days[date].temps;
            const avgTemp = temps.reduce((acc, temp) => acc + temp, 0) / temps.length;
            const winds = days[date].winds;
            const avgWind = winds.reduce((acc, wind) => acc + wind, 0) / winds.length;
            const humidities = days[date].humidities;
            const avgHumidity = humidities.reduce((acc, humidity) => acc + humidity, 0) / humidities.length;
            const icon = days[date].icons[0];

            dailyCard.innerHTML += `
                <li class="card">
                    <h3>Date: ${date}</h3>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="image" alt="Weather Icon">
                    <h6>Temp: ${avgTemp.toFixed(2)}°C</h6>
                    <h6>Wind: ${avgWind.toFixed(2)} m/s</h6>
                    <h6>Humidity: ${avgHumidity.toFixed(2)}%</h6>
                </li>
            `;
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

searchBtn.addEventListener('click', function() {
const city = cityName.value.trim(); 

    if(city===''){
        alert('Please enter city name.')
    }
        const currentCity= city[0].toUpperCase()+city.slice(1);
    fetchWeather(currentCity);
});
