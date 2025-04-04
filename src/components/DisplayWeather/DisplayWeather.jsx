import React from 'react';

export default function WeatherDisplay({ weather }) {
  return (
    <div className="WeatherDisplay">
      <section>
        <h2>Weather for {weather.name}</h2>

        <div>
          <h3>Current Conditions</h3>
          <div>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Feels like: {weather.main.feels_like}°C</p>
            <p>
              Conditions: {weather.weather[0].main},{' '}
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
