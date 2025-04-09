import React from 'react';

import './WeatherDisplay.css';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function WeatherDisplay({ weather, temperatureUnit }) {
  const groupWeatherByDay = (weatherList) => {
    const groupedData = {};

    weatherList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString();

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = [];
      }

      groupedData[dateKey].push(item);
    });
    const sliced = Object.entries(groupedData).slice(0, 5);
    return Object.fromEntries(sliced);
  };

  const getDailyForecast = (weatherList) => {
    const groupedByDay = groupWeatherByDay(weatherList);
    const dailyForecast = [];

    Object.keys(groupedByDay).forEach((date) => {
      const dayData = groupedByDay[date];

      const morning = dayData.find((item) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getHours() === 8;
      });

      const afternoon = dayData.find((item) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getHours() === 14;
      });

      const evening = dayData.find((item) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getHours() === 20;
      });

      dailyForecast.push({
        date,
        morning,
        afternoon,
        evening,
      });
    });

    return dailyForecast;
  };

  const dailyForecast = getDailyForecast(weather.list);
  console.log(weather);
  return (
    <>
      <h2 className="WeatherDisplay__header">{weather.city.name}</h2>
      <div className="WeatherDisplay">
        {dailyForecast.map((day, index) => (
          <div key={index} className="WeatherDisplay__day">
            <h3 className="WeatherDisplay__day__header">
              {days[new Date(day.date).getDay()]}
            </h3>

            {day.morning && (
              <div className="WeatherDisplay__day__card">
                <h4>Morning</h4>
                <p>
                  {Math.round(day.morning.main.temp)}{' '}
                  {temperatureUnit === 'metric' ? '°C' : '°F'}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.morning.weather[0].icon}@2x.png`}
                />
              </div>
            )}

            {day.afternoon && (
              <div className="WeatherDisplay__day__card">
                <h4>Afternoon</h4>
                <p>
                  {Math.round(day.afternoon.main.temp)}{' '}
                  {temperatureUnit === 'metric' ? '°C' : '°F'}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.afternoon.weather[0].icon}@2x.png`}
                />
              </div>
            )}

            {day.evening && (
              <div className="WeatherDisplay__day__card">
                <h4>Evening</h4>
                <p>
                  {Math.round(day.evening.main.temp)}{' '}
                  {temperatureUnit === 'metric' ? '°C' : '°F'}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.evening.weather[0].icon}@2x.png`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
