import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import warningLogo from '../assets/warning.png'
import unknownWeatherIcon from '../assets/weather-unknown.png';
import sunrise from '../assets/sunrise1.png'
import sunset from '../assets/sunset1.png'
import humidityIcon from '../assets/humidity1.png'
import pressureIcon from '../assets/pressure.png'
import windIcon from '../assets//wind.png'
import windDirectionIcon from '../assets/wind-direction.png'
import windGustIcon from '../assets/wind-gust.png'
import visibilityIcon from '../assets/visibility.png'
import cloudinessIcon from '../assets/Cloudiness.png'
import LoadingPage from '../components/LoadingPage'
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

export default function Home() {

    const API_KEY = process.env.REACT_APP_API_KEY;

    // const [latitude, setLatitude] = useState(0);
    // const [longitude, setLongitude] = useState(0);
    const [currentWeather, setCurrentWeather] = useState({
        "name": "?",
        "icon": "?",
        "temp": "?",
        "feels_like": "?",
        "weather_description": "?",
        "humidity": "?",
        "pressure": "?",
        "wind_speed": "?",
        "wind_direction": "?",
        "wind_gust": "?",
        "visibility": "?",
        "cloudiness": "?",
        "sunrise": "?",
        "sunset": "?",
    });
    const [loadingState, setLoadingState] = useState(true);

    const latitude = useSelector(state => state.latitude);
    const longitude = useSelector(state => state.longitude);

    const dispatch = useDispatch();

    const { setLongitude, setLatitude } = bindActionCreators(actionCreators, dispatch);

    const setAutoPosition = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    }

    const autoPositioning = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setAutoPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const fetchWeather = async (lat, long) => {
        const fetchingWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const fetchedWeather = await fetchingWeather.json();
        setCurrentWeather({
            "name": fetchedWeather.name,
            "icon": fetchedWeather.weather[0].icon,
            "temp": fetchedWeather.main.temp,
            "feels_like": fetchedWeather.main.feels_like,
            "weather_description": fetchedWeather.weather[0].description,
            "humidity": fetchedWeather.main.humidity,
            "pressure": fetchedWeather.main.pressure,
            "wind_speed": fetchedWeather.wind.speed,
            "wind_direction": fetchedWeather.wind.deg,
            "wind_gust": fetchedWeather.wind.gust,
            "visibility": fetchedWeather.visibility,
            "cloudiness": fetchedWeather.clouds.all,
            "sunrise": unixToLocalTime(fetchedWeather.sys.sunrise),
            "sunset": unixToLocalTime(fetchedWeather.sys.sunset),
        });
    }

    const getFiveDayWeather = async (lat, long) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`
        const fetchingWeather = await fetch(url);
        const weatherData = await fetchingWeather.json();
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = await weatherData.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            } else{
                return null;
            }
        });
        console.log(fiveDaysForecast);
    }

    const unixToLocalTime = (timestrap) => {
        const date = new Date((parseInt(timestrap) * 1000));
        // const hours   = ('0' + date.getHours()).slice(-2),
        // minutes = ('0' + date.getMinutes()).slice(-2);
        // return `${hours}:${minutes}`;
        const localizedTime = date.toLocaleTimeString();
        return localizedTime;
    }

    useEffect(() => {
        autoPositioning();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        try {
            setLoadingState(true);
            if (latitude !== 0 && longitude !== 0) {
                fetchWeather(latitude, longitude);
                getFiveDayWeather(latitude,longitude);
            }
            // console.log(latitude, longitude, currentWeather);
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoadingState(false);
        }
    }, [latitude, longitude])

    return (
        <>
            {(loadingState !== true) ?
                <div className="container" id="home-container">
                    <Navbar autoPositioning={autoPositioning} />
                    <div className="container" id="home-inner-container">
                        <div className="container" id="weather-location-container">
                            <span id="weather-location">{currentWeather.name}</span>
                            <div className="current-date-time">
                                <span id="date">9th Sept 2023</span>
                                <span id="time">08:45PM</span>
                            </div>
                        </div>
                        <div className="container" id="weather-alert-container">
                            <div className="img-wrapper">
                                <img src={warningLogo} alt="Alert" id='alert-img' />
                            </div>
                            <p>alert - hidden
                                <span id="alert-title">alert title</span>
                                <span id="alert-time">alert time</span>
                                <span id="alert-title">alert title</span>
                            </p>
                        </div>
                        <div className="container" id="weather-info-container">
                            <div className="container" id="current-weather-condition-container">
                                <div className="container" id="current-weather-container">
                                    <div className="img-wrapper">
                                        <img id='current-weather-icon' src={(currentWeather.icon !== "?") ? `https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png` : unknownWeatherIcon} alt="weather-icon" />
                                    </div>
                                    <div className="container" id="current-weather-info-container">
                                        <p id='current-temp'>{currentWeather.temp}°C</p>
                                        <p>Feels Like: <span id='feels-like'>{currentWeather.feels_like}°C</span></p>
                                        <p id='current-weather-condition'>{currentWeather.weather_description}</p>
                                    </div>
                                </div>
                                <div className="container" id="current-weather-other-info-outer-container">
                                    <div className="container" id="current-weather-other-info-inner-container">
                                        <div className="container" id="current-humidity-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={humidityIcon} alt="humidity-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.humidity}%</span>
                                            <p>Humidity</p>
                                        </div>
                                        <div className="container" id="current-pressure-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={pressureIcon} alt="pressure-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.pressure}hPa</span>
                                            <p>Pressure</p>
                                        </div>
                                        <div className="container" id="current-wind-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={windIcon} alt="wind-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.wind_speed} m/s</span>
                                            <p>Wind</p>
                                        </div>
                                        <div className="container" id="current-wind-direction-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={windDirectionIcon} alt="wind-direction-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.wind_direction} deg</span>
                                            <p>Wind Direction</p>
                                        </div>
                                        <div className="container" id="current-wind-gust-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={windGustIcon} alt="wind-gust-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.wind_gust} m/s</span>
                                            <p>Wind Gust</p>
                                        </div>
                                        <div className="container" id="current-visibility-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={visibilityIcon} alt="visibility-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.visibility}m</span>
                                            <p>Visibility</p>
                                        </div>
                                        <div className="container" id="current-visibility-container">
                                            <div className="img-wrapper">
                                                <img className='current-weather-other-info-icon' src={cloudinessIcon} alt="cloudiness-icon" />
                                            </div>
                                            <span className='current-weather-other-info-value'>{currentWeather.cloudiness}%</span>
                                            <p>Cloudiness</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sunset / Sunrise */}

                            <div className="container" id="current-sunset-sunrise-container">
                                <div id="sunrise-container">
                                    <div className="left">
                                        <div className="img-wrapper">
                                            <img src={sunrise} alt="Sunrise" />
                                        </div>
                                        <p>Sunrise</p>
                                    </div>
                                    <div className="right">
                                        <p id="sunrise-time">{currentWeather.sunrise}</p>
                                    </div>
                                </div>
                                <div id="sunset-container">
                                    <div className="left">
                                        <div className="img-wrapper">
                                            <img src={sunset} alt="Sunset" />
                                        </div>
                                        <p>Sunset</p>
                                    </div>
                                    <div className="right">
                                        <p id="sunset-time">{currentWeather.sunset}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 5-DAy Forecast */}

                            <div className="container" id="five-day-forecast-container">
                                <p>5-Day Forecast</p>
                                <div className="container" id='forecast-container'>
                                    <div className="container single-forecast-container">
                                        <div className="forecast-date">2023-09-26</div>
                                        <div className="forecast-weather">img</div>
                                        <div className="forecast-temperature-max-min">
                                            <span className="temp-max">36°C</span> / <span className="temp-min">30°C</span>
                                        </div>
                                        <div className="forecast-humidity">90%</div>
                                        <div className="forecast-sunrise-sunset">
                                            <span className="sunrise">05:48:19 AM</span> / <span className="sunset">05:48:28 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <img src="https://openweathermap.org/img/wn/10d@4x.png" alt="weather-icon" /> */}
                    </div>
                </div> :
                <LoadingPage />}
        </>
    )
}
