// Header.js
import React, { useContext } from 'react';
import './Header.css';
import { SkyContext } from '../contexts/Skycontext';

function Header() {
    const { currentTime, location } = useContext(SkyContext);
    //console.log("Location: ", location)

    const offsetMinutes = currentTime.getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;

    return (
        <div className="header">
            <h1 className="header-title">SkySphereJS</h1>
            <div className="right-section">
                <span className="location">
                    {location.latitude && location.longitude ?
                        `Lat: ${location.latitude.toFixed(2)}, Long: ${location.longitude.toFixed(2)}` :
                        "Localisation non disponible"}
                </span>
                <span className="time"> {currentTime.toLocaleTimeString()} UTC {offsetHours >= 0 ? '+' : ''}{offsetHours}</span>

            </div>
        </div>
    );
}

export default Header;
