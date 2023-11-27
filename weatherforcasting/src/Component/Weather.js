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
  var minValue;
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
        console.log(response.data)
        const datamanage = managedata(response.data);
        setWeatherData(datamanage);

      } catch (error) {
        console.error('Error making GET request:', error.message);
      }
    };
    const roundTemperature = (temperature) => {
      return Math.round(temperature);
    };

    const getMinValue = (currentValue, previousMin) => {
      return currentValue < previousMin ? currentValue : previousMin;
    };
    
    const managedata = (data) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); 
    
      const filteredWeather = data.list.filter((weather) => {
        const weatherDate = new Date(weather.dt_txt.split(' ')[0]);
        return weatherDate >= currentDate && weatherDate <= new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      });
    
      const groupedByDate = filteredWeather.reduce((result, weather) => {
        const date = weather.dt_txt.split(' ')[0]; 
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(weather);
        return result;
      }, {});
    
      const weathers = Object.keys(groupedByDate).map((dateString) => {
        const dailyWeather = groupedByDate[dateString];
    
        const dateObject = new Date(dateString);
        const daysOfWeek = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
        const dayIndex = dateObject.getDay();
        const dayName = daysOfWeek[dayIndex];
        const minTemp = Math.min(...dailyWeather.map((weather) => weather.main.temp_min));
        const maxTemp = Math.max(...dailyWeather.map((weather) => weather.main.temp_max));
    
        return {
          Date: dateString,
          Day: dayName,
          lowest: roundTemperature((9 / 5) * (minTemp - 273.15) + 32),
          High: roundTemperature((9 / 5) * (maxTemp - 273.15) + 32),
          feelsLike: roundTemperature((9 / 5) * (dailyWeather[0].main.feels_like - 273.15) + 32),
          type: dailyWeather[0].weather[0].main,
        };
      });
    
      console.log("Hello", weathers);
    
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
            <h4>{weather.Day}</h4>
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