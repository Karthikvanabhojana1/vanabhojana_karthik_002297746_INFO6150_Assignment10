import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './weather.css';
import { useNavigate } from 'react-router-dom';
import ImagesClear from '../Images/Clear.jpeg';
import ImagesClouds from '../Images/Clouds.jpeg';
import ImageSnown from '../Images/Snow.jpeg'
import ImageRain from '../Images/Rain.jpeg'

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    Date: '',
    High: '',
    lowest: '',
    feelsLike: '',
  });
  const navigate = useNavigate();
  const weatherImages = {
    Clear: ImagesClear,
    Clouds: ImagesClouds,
    Rain: ImageRain,
    Snow: ImageSnown,
  };
  useEffect(() => {
    const fetchData = async () => {
      var city = "Boston";
      var APIkey = "f9ca77215e0e5fc06f4d8641e77ed5ac";
      var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

      try {
        const response = await axios.get(apiUrl);
        const datamanage = managedata(response.data);
        setWeatherData(datamanage);

      } catch (error) {
        console.error('Error making GET request:', error.message);
      }
    };
    const roundTemperature = (temperature) => {
      return Math.round(temperature);
    };
    
    const managedata = (data) => {
      
      let filteredWeather = data.list.filter((weather) => weather.dt_txt.includes('12:00:00'));
      // const myArray = 
      const dateString = data.dt_txt;
      const dateObject = new Date(dateString);
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayIndex = dateObject.getDay();
      const dayName = daysOfWeek[dayIndex];
      let weathers = filteredWeather.map((weather) => ({
        Date: weather.dt_txt,
        Day: dayName,
        lowest: roundTemperature((9 / 5) * (weather.main.temp_min - 273.15) + 32),
        High: roundTemperature((9 / 5) * (weather.main.temp_max - 273.15) + 32),
        feelsLike: roundTemperature((9 / 5) * (weather.main.feels_like - 273.15) + 32),
        type: weather.weather[0].main,
      }));

      return weathers;
    };

    fetchData();
  }, []);

  
 

  const generateCard = (label, value) => (
    <div className="card">
      <div className="card-content">
        <p className="font-bold">{label}</p>
        <p>{value}°F</p>
      </div>
    </div>
  );
  

const handleCardClick = (clickedWeather) => {
  navigate(`/weather-daily/${clickedWeather.Date}`, { state: { weather: clickedWeather } });

};


// Function that returns the image URL based on weather condition
const getImageForWeatherCondition = (condition) => {
  return weatherImages[condition]
};
return (
  <div className="bg-white p-4 rounded shadow-lg" >
    <h1>Weather report for 5 days</h1>
    {weatherData && weatherData.length > 0 ? (
      <div className="card-container">
        {weatherData.map((weather, index) => (
          <div key={index} className="card-wrapper" onClick={() => handleCardClick(weather)}>
            <h3>{weather.Date.split(" ")[0]}</h3>
            {generateCard('High', weather.High)}
              {generateCard('Low', weather.lowest)}
              {generateCard('Feels Like', weather.feelsLike)}
              <img
        src={getImageForWeatherCondition(weather.type)}
        alt={weather.type}
        className="weather-image"
         />

          </div>
        ))}
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
};
 export default Weather;