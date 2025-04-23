// OpenWeatherMap API configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const CITY = 'Bangalore';
const COUNTRY = 'IN';

// DOM Elements
const tempElement = document.getElementById('temp');
const descriptionElement = document.getElementById('description');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const weatherIcon = document.getElementById('weather-icon');
const dateElement = document.getElementById('date');
const timeElement = document.getElementById('time');
const forecastContainer = document.getElementById('forecast-container');

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    
    // Update time
    timeElement.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Update weather icon based on weather condition
function updateWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Snow': 'fa-snowflake',
        'Thunderstorm': 'fa-bolt',
        'Drizzle': 'fa-cloud-rain',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog'
    };

    weatherIcon.className = `fas ${iconMap[condition] || 'fa-cloud'}`;
}

// Fetch current weather
async function getCurrentWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        // Update current weather
        tempElement.textContent = Math.round(data.main.temp);
        descriptionElement.textContent = data.weather[0].description;
        windElement.textContent = `${Math.round(data.wind.speed)} km/h`;
        humidityElement.textContent = `${data.main.humidity}%`;
        pressureElement.textContent = `${data.main.pressure} hPa`;
        
        // Update weather icon
        updateWeatherIcon(data.weather[0].main);
        
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

// Fetch 5-day forecast
async function getForecast() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        // Clear previous forecast
        forecastContainer.innerHTML = '';
        
        // Get one forecast per day (at noon)
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-icon">
                    <i class="fas ${getWeatherIcon(forecast.weather[0].main)}"></i>
                </div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        });
        
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Helper function to get weather icon class
function getWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Snow': 'fa-snowflake',
        'Thunderstorm': 'fa-bolt',
        'Drizzle': 'fa-cloud-rain',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog'
    };
    
    return iconMap[condition] || 'fa-cloud';
}

// Initialize
function init() {
    updateDateTime();
    getCurrentWeather();
    getForecast();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Update weather every 30 minutes
    setInterval(() => {
        getCurrentWeather();
        getForecast();
    }, 1800000);
}

// Start the application
init(); 