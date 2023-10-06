// Header.js
import React, { useContext } from 'react';
import './Header.css';
import { SkyContext } from '../contexts/Skycontext';

function Header({deviceType}) {
    const { orientation,currentTime, location } = useContext(SkyContext);
    //console.log("Location: ", location)

    const offsetMinutes = currentTime.getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
    const {alpha, beta,gamma}=orientation;
    return (
        <div className="header">
          {deviceType !== "mobile" && <h1 className="header-title">SkySphereJS</h1>}
            <div className="right-section">
                <span className="location">
                    {location.latitude && location.longitude && location.cityName?
                        `Lat: ${location.latitude.toFixed(2)}, Long: ${location.longitude.toFixed(2)}, ${location.cityName}` :
                        "Localisation non disponible"}
                </span>
                {alpha !== undefined && beta !== undefined && gamma !== undefined && (
                    <span className="orientation"> 
                        Alpha: {alpha.toFixed(2)}, Beta: {beta.toFixed(2)}, Gamma: {gamma.toFixed(2)}
                    </span>
                )}         
                <span className="time"> {currentTime.toLocaleTimeString()} UTC {offsetHours >= 0 ? '+' : ''}{offsetHours}</span>
               
            </div>
        </div>
    );
}

export default Header;
