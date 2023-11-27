
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './weather.css';
import { useLocation } from 'react-router-dom';
import ImagesClear from '../Images/Clear.jpeg';
import ImagesClouds from '../Images/Clouds.jpeg';
import ImageSnown from '../Images/Snow.jpeg'
import ImageRain from '../Images/Rain.jpeg'
import { useNavigate } from 'react-router-dom';


const WeatherDaily = () => {
  const location = useLocation();
  const weather = location.state?.weather;
  const selectedDate = weather.Date;
  var selectedDay = weather.Day;
  const weatherImages = {
    Clear: ImagesClear,
    Clouds: ImagesClouds,
    Rain: ImageRain,
    Snow: ImageSnown,
  };
  const [weatherData, setWeatherData] = useState([]);
  const [selectedDayName, setSelectedDayName] = useState("");
  const getImageForWeatherCondition = (condition) => {
    return weatherImages[condition];
  };
  useEffect(() => {
    const fetchData = async () => {
      const city = "Boston";
      const APIkey = "f9ca77215e0e5fc06f4d8641e77ed5ac";
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

      try {
        const response = await axios.get(apiUrl);
        const datamanage = managedata(response.data);
         selectedDay = selectDay();
        setWeatherData(datamanage);
      } catch (error) {
        console.error('Error making GET request:', error.message);
      }
    };

    const roundTemperature = (temperature) => {
      return Math.round(temperature);
    };

    const managedata = (data) => {

      const myArray = selectedDate.split(" ");

      let filteredWeather = data.list.filter((weatherData) =>
        weatherData.dt_txt.includes(myArray[0])
      );


      let weathers = filteredWeather.map((weatherData) => ({
        Date: weatherData.dt_txt,
        lowest: roundTemperature((9 / 5) * (weatherData.main.temp_min - 273.15) + 32),
        High: roundTemperature((9 / 5) * (weatherData.main.temp_max - 273.15) + 32),
        feelsLike: roundTemperature((9 / 5) * (weatherData.main.feels_like - 273.15) + 32),
        type: weatherData.weather[0].main,
      }));

 

      return weathers;
    };

    fetchData();
  }, [selectedDate]);

  const generateCard = (label, value) => (
    <div className="card" key={label}>
      <div className="card-content">
        <p className="font-bold">{label}</p>
        <p>{value}°F</p>
      </div>
    </div>
  );
  const generateCard1 = (label, value) => (
    <div className="card" key={label}>
      <div className="card-content">
        <p className="font-bold">{label}</p>
      </div>
    </div>
  );
  const selectDay = () => {
    const dateString = weather.Date.split(" ")[0];
    
    const dateObject = new Date(dateString);
    const daysOfWeek = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
    const dayIndex = dateObject.getDay();
    const dayName = daysOfWeek[dayIndex];

    setSelectedDayName(dayName);

    return dayName;
  }
  const navigate = useNavigate();

  const handleBackToHomeClick = () => {
    navigate('/');
  };
  return (
    <div className="bg-white p-4 rounded shadow-lg" id="head" >
            <button onClick={handleBackToHomeClick}>Home</button>

      <h1>Weather report for {selectedDayName} ({selectedDate.split(" ")[0]})</h1>
      {weatherData && weatherData.length > 0 ? (
        <div className="card-container">
          {weatherData.map((weather, index) => (
            <div key={index} className="card-wrapper">
            <h3>{weather.Date.split(" ")[1]}</h3>
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

export default WeatherDaily;