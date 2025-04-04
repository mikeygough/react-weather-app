import React, { useState } from 'react';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export default function Weather() {
  const [zip, setZip] = useState('');
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
      // console.log(lat, lon);

      // fetch weather from coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather data not available');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
      // console.log(weatherData);
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

  return (
    <div>
      <h1>Weather Forecast</h1>

      <section>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter ZIP Code"
            onChange={handleZipChange}
            value={zip}
            aria-label="ZIP Code"
          />
          <button type="submit" disabled={zip.length < 5 || loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>

        {loading && <p>Loading weather data...</p>}
        {error && <p>{error}</p>}
      </section>

      {weather && (
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
      )}
    </div>
  );
}
