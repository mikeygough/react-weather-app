import React, { useState } from 'react';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

import WeatherDisplay from '../DisplayWeather/WeatherDisplay';

import './Weather.css';

export default function Weather() {
  const [zip, setZip] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // validation, only allow numbers up to 5 characters
  const handleZipChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue) && inputValue.length <= 5) {
      setZip(inputValue);
    }
  };

  // get data
  const fetchWeatherData = async (zipCode) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      // fetch coordinates from ZIP
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`
      );

      if (!geoResponse.ok) {
        throw new Error('Could not find location for this ZIP code');
      }

      const geoData = await geoResponse.json();
      const { lat, lon } = geoData;

      // fetch weather from coordinates
      const weatherResponse = await fetch(
        // `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${temperatureUnit}&appid=${apiKey}`
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${temperatureUnit}&appid=${apiKey}`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather data not available');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
      console.log(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zip.length === 5) {
      fetchWeatherData(zip);
    }
  };

  const handleTemperatureUnitChange = (event) => {
    setTemperatureUnit(event.target.value);
  };

  return (
    <div className="Weather">
      <section>
        <form className="Weather__form" onSubmit={handleSubmit}>
          <label for="zip">Enter Zip Code</label>
          <input
            id="zip"
            type="text"
            onChange={handleZipChange}
            value={zip}
            aria-label="ZIP Code"
          />
          <label>
            <input
              type="radio"
              value="metric"
              name="radioGroup"
              checked={temperatureUnit === 'metric'}
              onChange={handleTemperatureUnitChange}
            />
            Metric
          </label>
          <label>
            <input
              type="radio"
              value="imperial"
              name="radioGroup"
              checked={temperatureUnit === 'imperial'}
              onChange={handleTemperatureUnitChange}
            />
            Imperial
          </label>
          <button type="submit" disabled={zip.length < 5 || loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>

        {loading && <p>Loading weather data...</p>}
        {error && <p>{error}</p>}
      </section>

      {!loading && !error && weather && (
        <WeatherDisplay
          weather={weather}
          temperatureUnit={temperatureUnit}
        />
      )}
    </div>
  );
}
