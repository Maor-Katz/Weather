import React from 'react';
import './App.css';
import Homepage from "./Homepage";
import {BrowserRouter as Router} from 'react-router-dom'
import Favorites from "./Favorites";
import {Route} from 'react-router'
import stormArea from './imagesWeather/stormArea.png'
import cloudy from './imagesWeather/cloudy.png'
import sunny from './imagesWeather/sunny.png'
import mostlyCloudy from './imagesWeather/mostlyCloudly.png'
import partlySunny from './imagesWeather/partlySunny.png'
import mostlySunny from './imagesWeather/mostlySunny.png'
import rain from './imagesWeather/rain.png'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            destinationToShowAfterFavorite: {}
        };
    }

    deleteFromFavorites = (indexFavorite) => {
        const {favorites} = this.state;
        const afterDelete = favorites.filter((destination, index) => {
            if (index === indexFavorite) {
                return false;
            }
            else {
                return true;
            }
        })
        this.setState({favorites: afterDelete})
    }

    imageByIconNum = (weatherIcon) => {
        switch (weatherIcon) {
            case 1:
                return sunny;
                break;
            case 2:
                return mostlySunny;
                break;
            case 3:
                return cloudy;
                break;
            case 4:
                return mostlyCloudy;
                break;
            case 5:
                return rain;
                break;
            case 6:
                return stormArea;
                break;
            default:
                return partlySunny;
        }
    }

    addToFavorites = (destination) => {
        var outFromFunc = false;
        const {favorites} = this.state;
        const newfavorites = favorites.concat(destination);
        if (favorites.length > 0) {
            favorites.map(desti => {
                if (`${destination.city}${destination.country}` === `${desti.city}${desti.country}`) {
                    outFromFunc = true;
                }
            })
        }
        if (outFromFunc) {
            return
        }
        this.setState({favorites: newfavorites});
    }

    render() {
        const {favorites} = this.state;
        return <Router>
            <Route path="/" exact component={() => <Homepage imageByIconNum={this.imageByIconNum}
                                                             addToFavorites={this.addToFavorites}/>}/>
            <Route exact path="/favorites" exact
                   component={() => <Favorites favorites={favorites} deleteFromFavorites={this.deleteFromFavorites}
                                               imageByIconNum={this.imageByIconNum}/>}/>
        </Router>
    }
}

export default App;