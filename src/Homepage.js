import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'
import Autosuggest from 'react-autosuggest';
import webMap from './imagesWeather/webmap.jpg'
import Button from '@material-ui/core/Button';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autosuggestList: [],
            value: '',
            destinationToShow: {},
            weatherForWeek: [],
            starIcon: false
        };
    }

    renderSuggestion = suggestion => {
        return <div>
            {`${suggestion.LocalizedName}, ${suggestion.Country.LocalizedName}`}
        </div>
    }

    isEmpty = (obj) => {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }

    getSuggestionValue = suggestion => {
        let {destinationToShow, weatherForWeek} = this.state;
        fetch(`https://dataservice.accuweather.com/currentconditions/v1/${suggestion.Key}?apikey=gVJo9HGAD47KfDOKA4ecRERzZS6D0GfI &language=en-us&details=true`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then(res => {
                destinationToShow = res[0];
                destinationToShow['city'] = suggestion.LocalizedName;
                destinationToShow['country'] = suggestion.Country.LocalizedName;
                this.setState({destinationToShow});
            })
        fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${suggestion.Key}?apikey=gVJo9HGAD47KfDOKA4ecRERzZS6D0GfI &language=en-us&details=true&metric=true`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then(res => {
                const newWeatherForWeek = weatherForWeek.concat(res.DailyForecasts)
                this.setState({
                    weatherForWeek: newWeatherForWeek,
                    currentKey: suggestion.Key
                });
            })
        return suggestion.LocalizedName + ', ' + suggestion.Country.LocalizedName;
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionsFetchRequested = ({value}) => {
        fetch(`https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=gVJo9HGAD47KfDOKA4ecRERzZS6D0GfI &q=${value}&language=en-us`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then(res => {
                this.setState({
                    autosuggestList: res,
                    destinationToShow: {},
                    weatherForWeek: []
                })
            })
    };

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    epochToDate = (epoch, dayOrMonth) => {
        var d = new Date(0);
        d.setUTCSeconds(epoch);
        const dateToStr = d.toString();
        const arr = dateToStr.split(" ");
        if (dayOrMonth === 'day') {
            return arr[0];
        }
        else if (dayOrMonth === 'month') {
            return arr[1];
        }
        else if (dayOrMonth === 'number') {
            return arr[2];
        }
    }

    render() {
        const {autosuggestList, value, destinationToShow, weatherForWeek} = this.state;
        const {addToFavorites, imageByIconNum} = this.props;
        const inputProps = {
            placeholder: 'Type any destination',
            value,
            onChange: this.onChange
        };

        return <div className="App">
            <Link to="/favorites"> <span className="favoritesButton">Favorites</span></Link>
            <h1 className="titlePage"> Weather</h1>
            <Autosuggest
                onFocus={this.renderSuggestion}
                suggestions={autosuggestList}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
            {!this.isEmpty(destinationToShow) &&
            <div className="mainImage"><img src={imageByIconNum(destinationToShow.WeatherIcon)}
                                            className="mainImg" alt="alt"/></div>}
            {destinationToShow.Temperature && <div className="todayTitle">Today</div>}
            {destinationToShow.city &&
            <div className="locationOfWeather">{`${destinationToShow.city}, ${destinationToShow.country}`} <span
                className="addToFavorite"><Button className="addToFavoriteButton"
                                                  onClick={() => addToFavorites(destinationToShow)}
                                                  variant="outlined">
        Add To Favorites
      </Button></span></div>}
            {this.isEmpty(destinationToShow) && autosuggestList.length === 0 ?
                <div><img className="webMapImg" src={webMap} alt="alt"/></div> : null}
            {destinationToShow && <div className="weatherDetails">
                <div className="textPlusTemp">
                    {destinationToShow.Temperature && <div className="tempUnit">
                        <span>{`${destinationToShow.Temperature.Metric.Value} `}</span><span>{destinationToShow.Temperature.Metric.Unit}</span>
                    </div>}
                    <div className="weatherText">{destinationToShow.WeatherText}</div>
                    {destinationToShow.RealFeelTemperature && <div className="realTempUnit">
                        <span>{`Real Feel ${destinationToShow.RealFeelTemperature.Metric.Value} `}</span><span>{destinationToShow.RealFeelTemperature.Metric.Unit}</span>
                    </div>}
                </div>
                <div className="textWind">
                    {destinationToShow.Wind && <div className="windUnit"><span>speed:</span>
                        <span>{`${destinationToShow.Wind.Speed.Metric.Value} `}</span><span>{destinationToShow.Wind.Speed.Metric.Unit}</span>
                    </div>}
                    {destinationToShow.RelativeHumidity &&
                    <div className="humidity"><span>{`Humidity: `}</span>{`${destinationToShow.RelativeHumidity}%`}
                    </div>}
                    {destinationToShow.Pressure && <div className="pressureUnit">
                        <span>{`Pressure: `}</span>{`${destinationToShow.Pressure.Metric.Value} `}{destinationToShow.Pressure.Metric.Unit}
                    </div>}
                </div>
            </div>}
            {weatherForWeek && <div className="weatherForAllWeek">
                {weatherForWeek.map((day, index) => {
                    return <div className={index === 0 ? 'displayNone' : 'specificDay'} key={index}>
                        <div className="dayForSpecificDay">{this.epochToDate(day.EpochDate, 'day')}</div>
                        <div className="dateForSpecificDay">
                            <span>{`${this.epochToDate(day.EpochDate, 'month')} `}</span><span>{this.epochToDate(day.EpochDate, 'number')}</span>
                        </div>
                        {day.Day && <div className="imgForSpecificDay"><img src={imageByIconNum(day.Day.Icon)}
                                                                            className="imgForDay" alt="alt"/></div>}
                        {day.Temperature && <div className="rangeForSpecificDay">
                            <span>{day.Temperature.Maximum.Value}</span><span>{`/${day.Temperature.Minimum.Value}`}</span><span>{` ${day.Temperature.Minimum.Unit}`}</span>
                        </div>}
                        {day.Temperature && <div className="descriptionForSpecificDay">{day.Day.ShortPhrase}</div>}
                    </div>
                })}
            </div>}
        </div>;
    }
}

export default Homepage;