import * as React from 'react';
import './App.css';
import Search from './components/search/search.js'
import Error from './components/error/error.js'
import Weather from './components/weather/weather.js'
import Forecast from './components/forecast/forecast.js'
import GoBackButton from './components/goback/goback.js'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      submittedValue: null,
      weather: null,
      defWeather: null,
      units: "metric",
      currentDate: null,
      forecast: null,
      isLoaded: false,
      isError: false,
      isSubmitted: false,
      weatherData: null
    }
  }
  handleChange = e => {
    this.setState({ value: e.target.value })
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isError: false, isLoaded: false, submittedValue: this.state.value })
    const apikey = process.env.REACT_APP_WEATHER_API_KEY;
    const appid = `${apikey}&units=${this.state.units}`
    const baseLink = "https://api.openweathermap.org/data/2.5";
    fetch(`${baseLink}/weather?q=${this.state.value}&appid=${appid}`)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.cod === "404") {
            this.setState({
              isError: true,
              isSubmitted: true,
            })
          } else {
            let weatherArr = {
              lat: result.coord.lat,
              lon: result.coord.lon,
              minTemp: result.main.temp_min,
              maxTemp: result.main.temp_max,
              temp: result.main.temp,
              name: result.name,
              desc: result.weather[0].description,
              icon: result.weather[0].icon,
              feelsLike: result.main.feels_like,
              pressure: result.main.pressure,
              humidity: result.main.humidity,
              windSpeed: result.wind.speed,
              visibility: result.visibility,
              country: result.sys.country,
              currentDate: result.dt
            }
            this.setState({
              isError: false,
              isSubmitted: true,
            })
            fetch(`${baseLink}/onecall?lat=${weatherArr.lat}&lon=${weatherArr.lon}&exclude=current,minutely,hourly&appid=${appid}`)
              .then(res => res.json())
              .then((result) => {
                if (result.cod === "400") {
                  this.setState({
                    isError: true,
                    isLoaded: true
                  })
                } else {
                  weatherArr.dewPoint = result.daily[0].dew_point;
                  this.setState({
                    forecast: result.daily.splice(1),
                    isLoaded: true,
                    weather: weatherArr,
                    defWeather: weatherArr
                  })
                }
              }).catch(() => {
                this.setState({
                  isLoaded: true,
                  isError: true
                })
              }
              )
          }
        }
      ).catch(
        () => {
          this.setState({
            isLoaded: true,
            isError: true,
            isSubmitted: true
          })
        }
      )
  }
  celsiusToFahrenheit = e => {
    // eslint-disable-next-line
    this.state.units = "imperial";
    this.handleSubmit(e);
  }
  fahrenheitToCelsius = e => {
    // eslint-disable-next-line
    this.state.units = "metric";
    this.handleSubmit(e);
  }
  handleClick(dayOfWeek) {
    const f = this.state.forecast;
    let day = f.find(i => i.dt === dayOfWeek);
    const weatherData = this.state.weather;
    const wArr = {
      ...weatherData,
      minTemp: day.temp.min,
      maxTemp: day.temp.max,
      temp: day.temp.day,
      desc: day.weather[0].description,
      icon: day.weather[0].icon,
      feelsLike: day.feels_like.day,
      pressure: day.pressure,
      humidity: day.humidity,
      windSpeed: day.wind_speed,
      dewPoint: day.dew_point,
      currentDate: day.dt
    }
    this.setState({
      weather: wArr
    })
  }
  sayHello = () => {
    alert("Hello!");
  }
  render() {
    const { isError, isLoaded, isSubmitted, weather, defWeather, units, forecast, value } = this.state;
    return (
      <div className="appContainer">
        <Router>
          <Switch>
            <Route path="/:day">
              <div className="weekContainer">
                <Weather data={weather} units={units} celsToFahr={this.celsiusToFahrenheit} fahrToCels={this.fahrenheitToCelsius} />
                <GoBackButton />
              </div>
            </Route>
            <Route exact path="/">
              <Search val={value} change={this.handleChange} submit={this.handleSubmit} />
              {!isError && isLoaded && isSubmitted &&
                <div className="main">
                  <Weather data={defWeather} units={units} celsToFahr={this.celsiusToFahrenheit} fahrToCels={this.fahrenheitToCelsius} />
                  <Forecast data={forecast} click={i => this.handleClick(i)} />
                </div>
              }
            </Route>
          </Switch>
          {isError &&
            <div className="main">
              <Error />
            </div>}
          {!isLoaded && isSubmitted && !isError && <div className="loader" />}
        </Router>
      </div>
    );
  }
}
export default App;