import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

export class Favorites extends React.Component {

    render() {
        const {favorites, imageByIconNum} = this.props;

        return <div className="Favorites">
            <h1 className="titlePage">Favorites</h1>
            <Link to="/"> <span className="favoritesButton">Homepage</span></Link>
            {favorites.length > 0 && <div className="favoriteSection">{favorites.map((dest, index) => {
                return <div className="favoriteDetails" key={index}>
                    <div className="imgForSpecificDayFavorite"><img src={imageByIconNum(dest.WeatherIcon)}
                                                                    className="imgForDayFavorite" alt="alt"/></div>
                    <div className="locationOfWeatherFavorite">{`${dest.city}, ${dest.country}`} </div>
                    <div className="textPlusTempFavorite">
                        {dest.Temperature && <div className="tempUnitFavorite">
                            <span>{`${dest.Temperature.Metric.Value} `}</span><span>{dest.Temperature.Metric.Unit}</span>
                        </div>}
                        <div className="weatherTextFavorite">{dest.WeatherText}</div>
                        {dest.RealFeelTemperature && <div className="realTempUnitFavorite">
                            <span>{`Real Feel ${dest.RealFeelTemperature.Metric.Value} `}</span><span>{dest.RealFeelTemperature.Metric.Unit}</span>
                        </div>}
                    </div>
                    <div className="textWindFavorite">
                        {dest.Wind && <div className="windUnitFavorite"><span>speed:</span>
                            <span>{`${dest.Wind.Speed.Metric.Value} `}</span><span>{dest.Wind.Speed.Metric.Unit}</span>
                        </div>}
                        {dest.RelativeHumidity &&
                        <div className="humidityFavorite"><span>{`Humidity: `}</span>{`${dest.RelativeHumidity}%`}
                        </div>}
                        {dest.Pressure && <div className="pressureUnitFavorite">
                            <span>{`Pressure: `}</span>{`${dest.Pressure.Metric.Value} `}{dest.Pressure.Metric.Unit}
                        </div>}
                    </div>
                </div>
            })}
            </div>}
        </div>;
    }
}

export default Favorites;