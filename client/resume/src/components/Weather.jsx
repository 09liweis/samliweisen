import React, {useState,useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {Box, BoxTitle, BoxBody} from './style.jsx';

const WeatherDesc = styled.div`
  font-weight:bold;
  font-size:20px;
`;
const WeatherWrapper = styled.section`
  position:relative;
`;
const WeatherIcon = styled.img`
  position:absolute;
  top: -10px;
  right: -5px;
`;
const api = 'https://api.openweathermap.org/data/2.5/weather';
const emptyWeatherInfo = {
  city: '',
  temp: '',
  temp_min:'',
  temp_max:'',
  feels_like:'',
  description:'',
  icon: '',
  country:'',
  sunset:'',
  sunrise:'',
};
const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(emptyWeatherInfo)
  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((pos) => {
        var {latitude,longitude} = pos.coords;
        fetchWeather(latitude,longitude);
      });
    } else {
      setLoading(false);
    }
  },[]);
  const sun2Time = (timestamp) => {
    const date = new Date(timestamp*1000);
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;
    return `${hour}:${min}:${sec}`;
  }
  const fetchWeather = (lat, lon) => {
    axios.get(api, {
      params: {
        appid: '323b480b81057a727bed54d9532159d6',
        lat: lat,
        lon: lon,
        units: 'metric'
      }
    })
    .then((res) => {
      const data = res.data;
      const main = data.main;
      const weather = data.weather[0];
      const sys = data.sys;
      setLoading(false);
      var newWeatherInfo = {
        sunrise:sun2Time(sys.sunrise),
        sunset:sun2Time(sys.sunset),
        description:weather.description,
        feels_like:Math.floor(main.feels_like),
        city: data.name,
        temp: Math.floor(main.temp),
        temp_min:Math.floor(main.temp_min),
        temp_max:Math.floor(main.temp_max),
        country:sys.country,
        icon: 'https://openweathermap.org/img/w/' + weather.icon + '.png',
      };
      setWeatherInfo(newWeatherInfo);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const {sunset,sunrise,country,temp,temp_min,temp_max,city,icon,feels_like,description} = weatherInfo;
  return (
    <Box className="weather">
      <BoxTitle bgColor={'#9d1024'}>
        <i className="boxIcon fa fa-map-marker" aria-hidden="true"></i>
        <span>Weather</span>
      </BoxTitle>
      <BoxBody>
        {loading ?
        <i className="fa fa-spinner loading" aria-hidden="true"></i>
        :
        <WeatherWrapper>
          <WeatherIcon src={icon}/>
          <WeatherDesc className='text-capitalize'>{description}</WeatherDesc>
          <div><span style={{'fontSize':'30px'}}>{temp} <sup>o</sup></span> <span>{city}, {country}</span></div>
          <div>{temp_max}<sup>o</sup>/{temp_min}<sup>o</sup> Feels like {feels_like} <sup>o</sup>C</div>
          <div>Sun: {sunrise}/{sunset}</div>
        </WeatherWrapper>
        }
      </BoxBody>
    </Box>
  );
}
export default Weather;