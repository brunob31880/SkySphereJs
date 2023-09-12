import React, { useState, useEffect,useContext } from 'react';
import Stars from './Stars';
import Constellations from './Constellations';
import { getSiderealTime } from '../utils/astroUtils';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Sky() {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const { shownConstellations,representation,location } = useContext(SkyContext);

    useEffect(() => {
        console.log("Changement de representation")
        if (representation === 'Equatorial') {
            setRotation({ x: 0, y: 0 });
        } else if (representation === 'Horizontal') {
            const longitude = location.longitude;
            const latitude = location.latitude;
            const LST = getSiderealTime(longitude);
            const LSTinRadians = THREE.MathUtils.degToRad(LST);
            const inclination = THREE.MathUtils.degToRad(90 - latitude);
            setRotation({ x: inclination, y: LSTinRadians });
        }
    }, [representation, location]);

    return (
        <>
            {/* Affiche les étoiles. */}
            <Stars rotation={rotation} />
            {/* Affiche les constellations. */}
            {shownConstellations==="Oui" && <Constellations rotation={rotation} />}
        </>
    );
}

export default Sky;
