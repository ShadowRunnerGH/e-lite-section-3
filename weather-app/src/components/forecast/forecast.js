import React from 'react';
import './forecast.css';
import { Link } from "react-router-dom";
function getDay(date) {
    let d = new Date(date * 1000);
    let dayPos = d.getDay();
    const daysOfTheWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    return daysOfTheWeek[dayPos];
}
function getDayOfMonth(date) {
    let d = new Date(date * 1000)
    return d.getDate();
}
export default class Forecast extends React.Component {
    render() {
        const forecasts = this.props.data;
        console.log("Entered forecast");
        if (forecasts != null)
            return (
                <div className="weatherForecast">
                    {forecasts.map(forecast => {
                        return (
                            <Link to={`/${getDay(forecast.dt).toLowerCase()}`} style={{ textDecoration: "none", marginBottom: "30px" }}>
                                <div className="forecast" onClick={() => this.props.click(forecast.dt)} key={forecast.dt}>
                                    <h3>{getDay(forecast.dt).substr(0, 3)} {getDayOfMonth(forecast.dt)}</h3>
                                    <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={`Icon showing ${getDay(forecast.dt)}'s weather`} />
                                    <div className="temperature">
                                        <span className={"maxTemp" + (Math.round(forecast.temp.max) > 99 ? " short" : "")}>{Math.round(forecast.temp.max)}&deg;</span>
                                        <span className={"minTemp" + (Math.round(forecast.temp.max) > 99 ? " short" : "")}>{Math.round(forecast.temp.min)}&deg;</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )
        else
            return (<div></div>)
    }
}