import React from 'react';

import './WeatherDisplay.css';

export default function WeatherDisplay({ weather, temperatureUnit }) {
  console.log(weather);
  return (
    <div className="WeatherDisplay">
      <section>
        <div className="WeatherDisplay__content">
          <h2>Weather for {weather.name}</h2>
          <h3>Current Conditions</h3>
          <div>
            <p>
              Temperature: {weather.main.temp}{' '}
              {temperatureUnit === 'metric' ? '°C' : '°F'}
            </p>
            <p>
              Feels like: {weather.main.feels_like}{' '}
              {temperatureUnit === 'metric' ? '°C' : '°F'}
            </p>
            <p>
              Conditions: {weather.weather[0].main},{' '}
              {weather.weather[0].description}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
