import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { SkyContext } from '../contexts/Skycontext';

function Sidebar() {
    const { maxShownMagnitude, setMaxShownMagnitude, representation, toggleRepresentation, shownConstellations, toggleShownConstellations } = useContext(SkyContext);

    // Utilisation d'un état local pour suivre la valeur du curseur
    const [sliderValue, setSliderValue] = useState(maxShownMagnitude);

    const handleSliderChange = (event) => {
        const newMagnitude = parseFloat(event.target.value);
        setSliderValue(newMagnitude);
        setMaxShownMagnitude(newMagnitude);
    };
   
    return (
        <div className="sidebar">
            <h2 className="representation-title">{representation}</h2>
            <button onClick={toggleRepresentation}>Basculer la représentation</button>
            <h2 className="constellations-title">Constellations: {shownConstellations}</h2>
            <div
                className={`toggle-btn ${shownConstellations === 'Oui' ? 'on' : 'off'}`}
                onClick={toggleShownConstellations}
            >
                <div className="toggle-indicator"></div>
            </div>

            <div className="magnitude-slider">
                <label>Magnitude maximale affichée: {sliderValue}</label>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={sliderValue}
                    onChange={handleSliderChange}
                />
            </div>
            <p className="debug-info">Appuyez sur <strong>d</strong> pour passer en mode debug.</p>
        </div>
    );
}

export default Sidebar;
