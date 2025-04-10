import React, { useCallback, useEffect, useState } from 'react';

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
  const fetchWeatherData = useCallback(
    async (zip) => {
      setLoading(true);
      setError(null);
      setWeather(null);

      try {
        // fetch coordinates from ZIP
        const geoResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`
        );

        if (!geoResponse.ok) {
          throw new Error(
            'Could not find location for this ZIP code'
          );
        }

        const geoData = await geoResponse.json();
        const { lat, lon } = geoData;

        // fetch weather from coordinates
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${temperatureUnit}&appid=${apiKey}`
        );

        if (!weatherResponse.ok) {
          throw new Error('Weather data not available');
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [temperatureUnit]
  );

  useEffect(() => {
    if (zip.length === 5) {
      fetchWeatherData(zip);
    }
  }, [fetchWeatherData, zip, temperatureUnit]);

  const handleTemperatureUnitChange = (event) => {
    setTemperatureUnit(event.target.value);
  };

  return (
    <div className="WeatherContainer">
      <div className="Weather__form__container">
        <section>
          <form
            className="Weather__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="Weather__form__textInput">
              <input
                id="zip"
                type="text"
                onChange={handleZipChange}
                value={zip}
                placeholder="zip code"
                aria-label="ZIP Code"
              />
            </div>

            <div className="Weather__form__radioInput">
              <label>
                <input
                  type="radio"
                  value="metric"
                  name="radioGroup"
                  checked={temperatureUnit === 'metric'}
                  onChange={handleTemperatureUnitChange}
                />
                metric
              </label>

              <label>
                <input
                  type="radio"
                  value="imperial"
                  name="radioGroup"
                  checked={temperatureUnit === 'imperial'}
                  onChange={handleTemperatureUnitChange}
                />
                imperial
              </label>
            </div>
          </form>

          <div className="Weather__form__states">
            {loading && <p>Loading weather data...</p>}
            {error && <p>{error}</p>}
          </div>
        </section>
      </div>
      <div className="Weather__results__container">
        {!loading && !error && weather && (
          <WeatherDisplay
            weather={weather}
            temperatureUnit={temperatureUnit}
          />
        )}
      </div>
    </div>
  );
}
