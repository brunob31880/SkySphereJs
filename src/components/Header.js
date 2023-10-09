// Header.js
import React, { useContext } from 'react';
import './Header.css';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Header({deviceType}) {
    const { currentTime, location } = useContext(SkyContext);
    //console.log("Location: ", location)

    const offsetMinutes = currentTime.getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
   
    return (
        <div className="header">
          {deviceType !== "mobile" && <h1 className="header-title">SkySphereJS</h1>}
            <div className="right-section">
                <span className="location">
                    {location.latitude && location.longitude && location.cityName?
                        `Lat: ${location.latitude.toFixed(2)}, Long: ${location.longitude.toFixed(2)}, ${location.cityName}` :
                        "Localisation non disponible"}
                </span>
                
                <span className="time"> {currentTime.toLocaleTimeString()} UTC {offsetHours >= 0 ? '+' : ''}{offsetHours}</span>
               
            </div>
        </div>
    );
}

export default Header;
