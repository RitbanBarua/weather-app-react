import React, { useState } from 'react'
import locateIcon from '../assets/current-location.png'
import searchIcon from '../assets/search.png'
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

export default function Navbar(props) {

    const { autoPositioning } = props;

    const API_KEY = process.env.REACT_APP_API_KEY;

    const [searchQuerry, setSearchQuerry] = useState("");

    // const latitude = useSelector(state => state.latitude);
    // console.log("lat=" + latitude)
    // const longitude = useSelector(state => state.longitude);
    // console.log('long=' + longitude)
    const dispatch = useDispatch();

    const { setLongitude, setLatitude } = bindActionCreators(actionCreators, dispatch);

    const search = () => {
        const searchBox = document.getElementById("search-box");
        setSearchQuerry(searchBox.value);
        if (searchBox.value !== "") {
            console.log(`Searching for ${searchBox.value}`);
            searchResult(searchBox.value);
        }
    }

    const searchResult = async (querry) => {
        const searchingResult = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${querry}&limit=1&appid=${API_KEY}`);
        const searchedResult = await searchingResult.json();
        setLatitude(searchedResult[0].lat);
        setLongitude(searchedResult[0].lon);
    }

    return (
        <>
            <nav className='container'>
                <div id="search-box-container">
                    <input type="search" id="search-box" />
                    <div className="img-wrapper" title='Locate Me' id="current-loc-icon-wrapper" onClick={autoPositioning}>
                        <img src={locateIcon} alt="" />
                    </div>
                    <div className="img-wrapper" title='Search' id="search-icon-wrapper" onClick={search}>
                        <img src={searchIcon} alt="" />
                    </div>
                </div>
            </nav>
        </>
    )
}
