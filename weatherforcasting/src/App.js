import logo from './logo.svg';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Weather from './Component/Weather';
import Dailyweather from './Component/Dailyweather';
function App() {
  
 return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Weather />}  />
      <Route path="/weather-daily/:date" element={<Dailyweather />} />
    </Routes>
  </BrowserRouter>
);
};



export default App;
